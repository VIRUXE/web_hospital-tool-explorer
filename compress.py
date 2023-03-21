import re
from css_html_js_minify import css_minify, js_minify

input_file      = 'index.html'  # Input HTML file
output_file     = 'app.html'  # Output compressed HTML file
exclude_js_file = 'file_structure.js'  # Exclude this JavaScript file from minification

try:
    with open(input_file, 'r', encoding='utf-8') as file:
        html_content = file.read()

    css_files = re.findall(r'<link href="(.+?\.css)" rel="stylesheet">', html_content)
    js_files  = re.findall(r'<script src="(.+?\.js)"></script>', html_content)

    for css_file in css_files:
        with open(css_file, 'r') as file:
            css_content  = file.read()
            minified_css = css_minify(css_content)
            html_content = html_content.replace(
                f'<link href="{css_file}" rel="stylesheet">',
                f'<style>{minified_css}</style>',
            )

    for js_file in js_files:
        with open(js_file, 'r', encoding='utf-8') as file:
            js_content = file.read()

        if js_file != exclude_js_file:
            js_content = js_minify(js_content)

        html_content = html_content.replace(
            f'<script src="{js_file}"></script>',
            f'<script>{js_content}</script>',
        )

    # Keep the file_structure.js human-readable, so that it is easy to edit.
    with open(exclude_js_file, 'r', encoding='utf-8') as file:
        file_structure_content = file.read()

    html_content = html_content.replace(
        f'<script src="{exclude_js_file}"></script>',
        f'<script>{file_structure_content}</script>',
    )

    # Remove "@charset "utf-8";" from the HTML. There is no need for it.
    html_content = html_content.replace('@charset "utf-8";', '')

    with open(output_file, 'w', encoding='utf-8') as file:
        file.write(html_content)

    print(f"Compression successful. Compressed HTML written to {output_file}")
except Exception as e:
    print(f"Error: {e}")
