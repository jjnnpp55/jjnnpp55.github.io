
import re
import os
import json
from bs4 import BeautifulSoup

def clean_feedback(text):
    if not text: return ""
    patterns = [
        re.escape("SR-OS (Service Router Operating System) is Nokia's OS for its service router portfolio."),
        re.escape("Mangle rules are used to mark connections and packets (mark-connection, mark-packet) for later processing in queues."),
        re.escape("PCC (Per Connection Classifier) is a popular method to distribute traffic across WANs."),
        r"(?i)it is used (for|to)\s+.*?\.",
        r"(?i)this command (is|allows)\s+.*?\.",
    ]
    for p in patterns:
        text = re.sub(p, "", text).strip()
    return text

def extract_quiz_data(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    questions = []
    for q_div in soup.find_all('div', class_='question'):
        question_text_tag = q_div.find('p', class_='question-text')
        options_tags = q_div.find('ul', class_='options')
        answer_tag = q_div.find('span', class_='answer')
        feedback_tag = q_div.find('div', class_='feedback')

        question_text = question_text_tag.get_text(strip=True) if question_text_tag else ""
        options = [li.get_text(strip=True) for li in options_tags.find_all('li')] if options_tags else []
        answer = answer_tag.get('data-answer', '').strip() if answer_tag and answer_tag.has_attr('data-answer') else (answer_tag.get_text(strip=True) if answer_tag else "")
        feedback = feedback_tag.get_text(strip=True) if feedback_tag else ""

        if question_text and options: # Only add a question if it has at least a question text and options
            questions.append({
                'question': question_text,
                'options': options,
                'answer': answer,
                'feedback': clean_feedback(feedback)
            })
    return questions

def generate_quiz_html(questions):
    quiz_html = '<form id="quiz-form">\n'
    for i, q in enumerate(questions):
        quiz_html += f'    <div class="question" id="question-{i+1}">\n'
        quiz_html += f'        <p class="question-text">{q["question"]}</p>\n'
        quiz_html += '        <ul class="options">\n'
        for option in q["options"]:
            quiz_html += f'            <li>{option}</li>\n'
        quiz_html += '        </ul>\n'
        quiz_html += f'        <span class="answer" data-answer="{q["answer"]}"></span>\n'
        quiz_html += f'        <div class="feedback">{q["feedback"]}</div>\n'
        quiz_html += '    </div>\n'
    quiz_html += '    <button type="submit">Submit Answers</button>\n'
    quiz_html += '</form>'
    return quiz_html

def generate_sidebar_html(current_file, file_order, categories_map, level_map):
    sidebar_html = '<div class="sidebar-content">\n'
    
    # Group files by category and level
    grouped_files = {}
    for f in file_order:
        found_category_prefix = None
        found_level = 'misc' # Default level if not found

        # Try to match category prefix from categories_map keys
        for cat_prefix in categories_map.keys():
            if f.startswith(cat_prefix):
                found_category_prefix = cat_prefix
                remaining_filename = f[len(cat_prefix):] # e.g., "begin1.html" or "1.html"
                
                # Try to extract level (begin, inter, advance)
                level_match = re.match(r"^(begin|inter|advance)(\d+)\.html$", remaining_filename)
                if level_match:
                    found_level = level_match.groups()[0]
                else:
                    # If no explicit level, check if the category prefix itself implies a level
                    # e.g., "musicb" -> "begin", "musicinter" -> "inter"
                    if "begin" in cat_prefix:
                        found_level = "begin"
                    elif "inter" in cat_prefix:
                        found_level = "inter"
                    elif "advance" in cat_prefix:
                        found_level = "advance"
                break # Found a category prefix, no need to check others

        if found_category_prefix:
            if found_category_prefix not in grouped_files:
                grouped_files[found_category_prefix] = {}
            if found_level not in grouped_files[found_category_prefix]:
                grouped_files[found_category_prefix][found_level] = []
            grouped_files[found_category_prefix][found_level].append(f)
        else:
            # Fallback for files that don't match any category prefix (shouldn't happen if categories_map is comprehensive)
            if 'unknown' not in grouped_files:
                grouped_files['unknown'] = {'misc': []}
            grouped_files['unknown']['misc'].append(f)


    for vendor_prefix, category_name in categories_map.items():
        is_open = "open" if current_file.startswith(vendor_prefix) else ""
        sidebar_html += f'    <details {is_open}>\n'
        sidebar_html += f'        <summary>{category_name}</summary>\n'
        if vendor_prefix in grouped_files:
            for level_prefix in ["begin", "inter", "advance", "misc"]:
                if level_prefix in grouped_files[vendor_prefix]:
                    level_display_name = level_map.get(level_prefix, level_prefix.capitalize())
                    is_level_open = "open" if current_file.startswith(f"{vendor_prefix}{level_prefix}") else ""
                    sidebar_html += f'        <details {is_level_open}>\n'
                    sidebar_html += f'            <summary>{level_display_name}</summary>\n'
                    for f in sorted(grouped_files[vendor_prefix][level_prefix]):
                        active_style = 'style="color: #be5103;"' if f == current_file else ""
                        # Clean up the display name for the link
                        display_name = f.replace(".html", "")
                        for p in [vendor_prefix, level_prefix]:
                            display_name = display_name.replace(p, "")
                        if not display_name: # If only prefix and level, e.g., nokiabegin1 -> 1
                            display_name = f.replace(".html", "").replace(vendor_prefix, "").replace(level_prefix, "").capitalize()
                        
                        sidebar_html += f'            <p><a href="{f}" {active_style}>{display_name.capitalize()}</a></p>\n'
                    sidebar_html += '        </details>\n'
        sidebar_html += '    </details>\n'
    sidebar_html += '</div>\n'
    return sidebar_html

def rewrite_file(filepath, template_path, file_order, categories_map, level_map):
    # Read the current content of the file to be rewritten
    with open(filepath, 'r', encoding='utf-8') as f:
        rewritten_html = f.read()

    # We are NOT going to touch the quiz content for now, only sidebar and navigation.
    # The current_file_html already contains the (incorrect) quiz content, but we will preserve it.

    current_file_name = os.path.basename(filepath)
    sidebar_html = generate_sidebar_html(current_file_name, file_order, categories_map, level_map)
    rewritten_html = re.sub(
        r'(<div class="sidebar-content">.*?</div>)',
        sidebar_html,
        rewritten_html,
        flags=re.DOTALL
    )

    current_index = file_order.index(current_file_name) if current_file_name in file_order else -1
    prev_file = file_order[current_index - 1] if current_index > 0 else None
    next_file = file_order[current_index + 1] if current_index < len(file_order) - 1 else None

    nav_html = '<div class="quiz-navigation">\n'
    if prev_file:
        nav_html += f'    <a href="{prev_file}" class="prev-quiz">Previous Quiz</a>\n'
    if next_file:
        nav_html += f'    <a href="{next_file}" class="next-quiz">Next Quiz</a>\n'
    nav_html += '</div>\n'

    rewritten_html = re.sub(
        r'(<div class="quiz-navigation">.*?</div>)',
        nav_html,
        rewritten_html,
        flags=re.DOTALL
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(rewritten_html)


if __name__ == "__main__":
    ROUTER_DIR = 'c:\\Users\\jjnnp\\OneDrive\\Desktop\\Quizzes\\ROUTER'
    MUSIC_DIR = 'c:\\Users\\jjnnp\\OneDrive\\Desktop\\Quizzes\\music'
    TEMPLATE_PATH = 'c:\\Users\\jjnnp\\OneDrive\\Desktop\\Quizzes\\ROUTER\\mytemplate.html'

    # Define the order of files for navigation
    router_file_order = [
        # Nokia
        *[f"nokiabegin{i}.html" for i in range(1, 6)],
        *[f"nokiainter{i}.html" for i in range(1, 6)],
        *[f"nokiaadvance{i}.html" for i in range(1, 6)],
        # TP-Link
        *[f"tplinkbegin{i}.html" for i in range(1, 6)],
        *[f"tplinkinter{i}.html" for i in range(1, 6)],
        *[f"tplinkadvance{i}.html" for i in range(1, 6)],
        # MikroTik
        *[f"mikrotikbegin{i}.html" for i in range(1, 6)],
        *[f"mikrotikinter{i}.html" for i in range(1, 6)],
        *[f"mikrotikadvance{i}.html" for i in range(1, 6)],
        # Cisco
        *[f"ciscobegin{i}.html" for i in range(1, 6)],
        *[f"ciscointer{i}.html" for i in range(1, 6)],
        *[f"ciscoadvance{i}.html" for i in range(1, 6)],
    ]

    router_categories_map = {
        "nokia": "Nokia SR OS",
        "tplink": "TP-Link Omada",
        "mikrotik": "MikroTik RouterOS",
        "cisco": "Cisco IOS"
    }
    router_level_map = {"begin": "Beginner", "inter": "Intermediate", "advance": "Advanced"}

    # Process MikroTik files for feedback purification
    print("Processing MikroTik files for feedback purification...")
    mikrotik_files = [
        os.path.join(ROUTER_DIR, f) for f in router_file_order if f.startswith("mikrotik")
    ]
    for filepath in mikrotik_files:
        if os.path.exists(filepath):
            print(f"Rewriting {os.path.basename(filepath)}")
            rewrite_file(filepath, TEMPLATE_PATH, router_file_order, router_categories_map, router_level_map)
        else:
            print(f"Warning: {filepath} not found. Skipping.")

    # Process Music files for navigation updates
    print("\nProcessing Music files for navigation updates...")
    music_files_raw = sorted([f for f in os.listdir(MUSIC_DIR) if f.endswith(".html")])
    
    # Infer music categories and levels from filenames
    music_categories_map = {}
    music_level_map = {"begin": "Beginner", "inter": "Intermediate", "advance": "Advanced", "misc": "Miscellaneous"}
    music_file_order = []

    # Group music files by inferred categories
    music_grouped_files = {}
    for f in music_files_raw:
        match = re.match(r"^(\\w+?)(begin|inter|advance)(\\d+)\\.html$", f)
        if match:
            category_prefix, level, num = match.groups()
            if category_prefix not in music_grouped_files: music_grouped_files[category_prefix] = []
            music_grouped_files[category_prefix].append(f)
            if category_prefix not in music_categories_map:
                music_categories_map[category_prefix] = category_prefix.capitalize() # Simple capitalization for now
        else:
            # Handle files like musicb1.html, musicadv1.html, musicinter1.html
            if f.startswith("musicb"):
                if "musicb" not in music_grouped_files: music_grouped_files["musicb"] = []
                music_grouped_files["musicb"].append(f)
                music_categories_map["musicb"] = "Music Basics"
            elif f.startswith("musicinter"):
                if "musicinter" not in music_grouped_files: music_grouped_files["musicinter"] = []
                music_grouped_files["musicinter"].append(f)
                music_categories_map["musicinter"] = "Music Intermediate"
            elif f.startswith("musicadv"):
                if "musicadv" not in music_grouped_files: music_grouped_files["musicadv"] = []
                music_grouped_files["musicadv"].append(f)
                music_categories_map["musicadv"] = "Music Advanced"
            else:
                # Fallback for any other music files
                if "other_music" not in music_grouped_files: music_grouped_files["other_music"] = []
                music_grouped_files["other_music"].append(f)
                music_categories_map["other_music"] = "Other Music Quizzes"

    # Reconstruct music_file_order based on grouped files for consistent navigation
    for category_prefix in sorted(music_grouped_files.keys()):
        music_file_order.extend(sorted(music_grouped_files[category_prefix]))

    for f in music_file_order:
        filepath = os.path.join(MUSIC_DIR, f)
        if os.path.exists(filepath):
            print(f"Rewriting {os.path.basename(filepath)}")
            rewrite_file(filepath, TEMPLATE_PATH, music_file_order, music_categories_map, music_level_map)
        else:
            print(f"Warning: {filepath} not found. Skipping.")

    print("\nAll specified files processed.")
