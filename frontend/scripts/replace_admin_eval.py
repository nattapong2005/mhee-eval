import re

path = r'e:\Competency\mhee_eval\frontend\app\(protected)\admin\evaluations\[id]\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Make substitutions

# Colors and backgrounds
content = content.replace('bg-slate-50', 'bg-gray-50')
content = content.replace('bg-slate-100', 'bg-gray-100')
content = content.replace('bg-slate-200', 'bg-gray-200')
content = content.replace('text-slate-200', 'text-gray-200')
content = content.replace('text-slate-300', 'text-gray-400')  # slight adjust
content = content.replace('text-slate-400', 'text-gray-500')
content = content.replace('text-slate-500', 'text-gray-500')
content = content.replace('text-slate-600', 'text-gray-600')
content = content.replace('text-slate-700', 'text-gray-700')
content = content.replace('text-slate-800', 'text-gray-800')
content = content.replace('text-slate-900', 'text-gray-900')
content = content.replace('border-slate-100', 'border-gray-100')
content = content.replace('border-slate-200', 'border-gray-200')
content = content.replace('border-slate-50', 'border-gray-50')
content = content.replace('divide-slate-50', 'divide-gray-50')

# Heavy shadows
content = content.replace('shadow-xl shadow-slate-200/50', 'shadow-sm')
content = content.replace('shadow-2xl shadow-slate-200/50', 'shadow-sm')
content = content.replace('shadow-lg shadow-primary-100', '')
content = content.replace('shadow-2xl shadow-primary-200', 'shadow-sm')
content = content.replace('shadow-lg shadow-emerald-100', '')
content = content.replace('shadow-xl shadow-primary-100', '')

# Typography
content = content.replace('font-black', 'font-semibold')
content = content.replace('font-bold', 'font-medium')
content = content.replace('uppercase tracking-widest', '')
content = content.replace('uppercase tracking-[0.2em]', '')
content = content.replace('text-[10px]', 'text-xs')
content = content.replace('text-[9px]', 'text-xs')
content = content.replace('tracking-tight', '')

# Button shapes padding
content = content.replace('px-12 py-5', 'px-6 py-2.5')
content = content.replace('px-8 py-4', 'px-4 py-2')
content = content.replace('py-4 bg-primary', 'py-2 bg-primary')
content = content.replace('px-5 py-4', 'px-3 py-2')
content = content.replace('px-6 py-5', 'px-4 py-2.5')
content = content.replace('px-4 py-1.5', 'px-3 py-1')

# Add font-sans wrapper
content = content.replace('<div className="space-y-8 pb-20">', '<div className="space-y-8 pb-20 font-sans">')

# Header design
content = content.replace('rounded-lg p-10', 'rounded-xl p-6')
content = content.replace('text-4xl', 'text-2xl')
content = content.replace('text-5xl', 'text-3xl')

# Blur decorations (remove them)
content = re.sub(r'<div className="absolute[^>]*blur[^>]*></div>', '', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
