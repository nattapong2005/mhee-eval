import sys
import re

file_path = r"e:\Competency\mhee_eval\frontend\app\(protected)\admin\evaluations\[id]\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Header Card
content = content.replace(
    '<div className="relative bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-800 overflow-hidden group">',
    '''<div className="relative bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800 overflow-hidden group/header">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-opacity duration-700 opacity-50 group-hover/header:opacity-100"></div>'''
)
content = content.replace(
    '<h1 className="text-2xl font-semibold text-white ">{evaluation?.name}</h1>',
    '<h1 className="text-3xl font-bold text-white tracking-tight leading-tight">{evaluation?.name}</h1>'
)
content = content.replace(
    '<div className="bg-gray-950/50 p-6 rounded-lg border border-gray-800 text-right min-w-[200px]">',
    '<div className="bg-gray-950/40 p-6 rounded-2xl border border-gray-800/60 text-right min-w-[200px] shadow-inner backdrop-blur-sm">'
)

# 2. Tabs
content = content.replace(
    '<div className="flex flex-wrap gap-3 bg-gray-900/50 p-2 rounded-lg border border-gray-800 backdrop-blur-sm sticky top-4 z-10 shadow-sm">',
    '<div className="flex flex-wrap gap-2 bg-gray-900/70 p-1.5 rounded-xl border border-gray-800/60 backdrop-blur-md sticky top-4 z-20 shadow-lg">'
)
content = content.replace(
    'className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 font-semibold text-sm  ${active',
    'className={`flex items-center gap-2.5 px-5 py-2.5 rounded-lg transition-all duration-300 font-medium text-sm  ${active'
)

# 3. Topics Cards
content = content.replace(
    '<div key={topic.id} className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden shadow-sm group">',
    '<div key={topic.id} className="bg-gray-900/80 rounded-2xl border border-gray-800 overflow-hidden shadow-md group/card hover:border-gray-700/80 hover:shadow-xl transition-all duration-300 backdrop-blur-sm">'
)
content = content.replace(
    '<div className="bg-gray-950/50 px-8 py-6 flex justify-between items-center border-b border-gray-800">',
    '<div className="bg-gray-950/60 px-8 py-5 flex justify-between items-center border-b border-gray-800/80">'
)

# 4. Add Topic Form
content = content.replace(
    '<div className="bg-primary-500/5 border-2 border-dashed border-primary-900 rounded-lg p-8 group hover:bg-primary-500/10 transition-all duration-500">',
    '<div className="bg-gray-900/30 border-2 border-dashed border-gray-800 hover:border-primary-500/50 rounded-2xl p-8 group hover:bg-gray-800/50 transition-all duration-500">'
)

# 5. Right Sticky Form Panel
content = content.replace(
    '<div className="sticky top-28 bg-gray-900 rounded-lg border border-gray-800 shadow-sm p-8 overflow-hidden relative">',
    '<div className="sticky top-28 bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-800 shadow-2xl p-8 overflow-hidden relative">'
)

# 6. Assignments Card
content = content.replace(
    '<div className="bg-gray-900 rounded-lg shadow-sm border border-gray-800 p-10">',
    '<div className="bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-800 p-10">'
)
content = content.replace(
    '<div className="bg-gray-900 rounded-lg shadow-sm border border-gray-800 overflow-hidden">',
    '<div className="bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-800 overflow-hidden">'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated OK")
