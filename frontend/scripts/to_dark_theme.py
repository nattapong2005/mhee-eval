import os
import re

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    replacements = {
        # Backgrounds
        'bg-white': 'bg-gray-900',
        'bg-gray-50': 'bg-gray-950',
        'bg-gray-100': 'bg-gray-800',
        'bg-gray-200': 'bg-gray-700',
        'hover:bg-gray-50': 'hover:bg-gray-800',
        'hover:bg-white': 'hover:bg-gray-800',
        'hover:bg-gray-100': 'hover:bg-gray-700',
        
        # Borders
        'border-gray-50': 'border-gray-800',
        'border-gray-100': 'border-gray-800',
        'border-gray-200': 'border-gray-700',
        'border-gray-300': 'border-gray-600',
        
        # Texts
        'text-gray-900': 'text-white',
        'text-gray-800': 'text-gray-100',
        'text-gray-700': 'text-gray-200',
        'text-gray-600': 'text-gray-300',
        'text-gray-500': 'text-gray-400',
        'text-gray-400': 'text-gray-500',
        
        # Primary colors (Adjusting for dark background)
        'bg-primary-50': 'bg-primary-950',
        'bg-primary-100': 'bg-primary-900',
        'text-primary-600': 'text-primary-400',
        'text-primary-700': 'text-primary-300',
        'text-primary-800': 'text-primary-200',
        'border-primary-100': 'border-primary-900',
        'border-primary-200': 'border-primary-800',
        
        # Emerald/Green
        'bg-emerald-50': 'bg-emerald-950',
        'bg-emerald-100': 'bg-emerald-900',
        'text-emerald-600': 'text-emerald-400',
        'text-emerald-700': 'text-emerald-300',
        'text-emerald-800': 'text-emerald-200',
        'border-emerald-100': 'border-emerald-900',
        'border-emerald-200': 'border-emerald-800',
        'bg-green-50': 'bg-green-950',
        'bg-green-100': 'bg-green-900',
        'text-green-600': 'text-green-400',
        'text-green-700': 'text-green-300',
        'text-green-800': 'text-green-200',
        'border-green-100': 'border-green-900',
        'border-green-200': 'border-green-800',
        
        # Red
        'bg-red-50': 'bg-red-950',
        'bg-red-100': 'bg-red-900',
        'text-red-400': 'text-red-500', 
        'text-red-600': 'text-red-400',
        'text-red-700': 'text-red-300',
        'text-red-800': 'text-red-200',
        'border-red-100': 'border-red-900',
        'border-red-200': 'border-red-800',
        
        # Blue
        'bg-blue-50': 'bg-blue-950',
        'bg-blue-100': 'bg-blue-900',
        'text-blue-600': 'text-blue-400',
        'text-blue-700': 'text-blue-300',
        'text-blue-800': 'text-blue-200',
        'border-blue-100': 'border-blue-900',
        'border-blue-200': 'border-blue-800',

        # Amber
        'bg-amber-50': 'bg-amber-950',
        'bg-amber-100': 'bg-amber-900',
        'text-amber-600': 'text-amber-400',
        'text-amber-700': 'text-amber-300',
        'text-amber-800': 'text-amber-200',
        'border-amber-100': 'border-amber-900',
        'border-amber-200': 'border-amber-800',
        
        # Divides
        'divide-gray-50': 'divide-gray-800',
        'divide-gray-100': 'divide-gray-800',
        'divide-gray-200': 'divide-gray-700',
        
        # Shadows
        'shadow-slate-200/50': 'shadow-black/50',
    }
    
    regex = re.compile(r'\b(' + '|'.join(map(re.escape, replacements.keys())) + r')\b')
    content = regex.sub(lambda match: replacements[match.group(0)], content)
    
    # Extra fix for bg-gray-50/50 -> bg-gray-950/50
    content = content.replace('bg-gray-50/50', 'bg-gray-950/50')
    content = content.replace('bg-gray-50/30', 'bg-gray-950/30')
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {filepath}")

def main():
    base_dirs = [
        r'e:\Competency\mhee_eval\frontend\app',
        r'e:\Competency\mhee_eval\frontend\components'
    ]
    for d in base_dirs:
        for root, dirs, files in os.walk(d):
            for file in files:
                if file.endswith(('.tsx', '.ts')):
                    replace_in_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
