import json

# Load the JSON file content
file_path = "topics/questions.json"
with open(file_path, "r") as file:
    data = json.load(file)

# Define a mapping to consolidate similar tags
tag_mapping = {
    "LeSS Huge": "LeSS",
    "Scrum Master": "Scrum",
    "Comparison": "Agile Methodologies",
    "limitations": "Challenges",
    "challenges": "Challenges",
    "Fault": "Fault Localization",
    "Bug": "Fault Localization",
    "tools": "Collaboration Tools",
    "Prototypes": "Design Thinking",
    "Steps": "Process",
    "Dependencies": "Dependency Analysis",
    "Data Flow": "Dependency Analysis",
    "Control Flow": "Dependency Analysis",
    "PDG": "Dependency Analysis",
    "Lean Software Development": "Lean Startup",
    "Evolution": "Trends",
    "Trends": "Trends",
    "Cross-Cultural": "Culture",
    "Knowledge Sharing": "Collaboration Tools",
    "Knowledge Loss": "Collaboration Tools",
    "Visits": "Collaboration Tools",
    "Work-Life Balance": "Team Dynamics",
    "Trust": "Team Dynamics",
    "Hyperproductivity": "Scrum",
    "Daily Meetings": "Scrum",
    "Retrospectives": "Scrum",
    "Sprints": "Scrum",
    "Proxy Customer": "Customer Focus",
    "Empathy": "Design Thinking",
    "Economic Impact": "Budgets",
    "Budgets": "Budgets",
    "Security": "Distributed Development",
    "Metrics": "Collaboration Tools",
    "Importance": "Challenges",
    "Interprocedural": "Dependency Analysis",
    "Static Analysis": "Dependency Analysis",
    "Dynamic Analysis": "Dependency Analysis",
    "Dynamic Slicing": "Dependency Analysis",
    "Program Dependence Graph": "Dependency Analysis",
    "Tarantula": "Fault Localization",
    "SemFix": "Fault Localization",
    "GenProg": "Fault Localization",
    "APR": "Fault Localization",
    "Symbolic Execution": "Fault Localization",
    "Product Owner": "Scrum",
    "Leadership": "Agile Methodologies",
    "Strategy Alignment": "Agile Methodologies",
    "CoPs": "Agile Methodologies",
    "OneTeam": "Scrum",
    "Distributed Teams": "Distributed Development",
    "Collaboration": "Collaboration Tools",
    "Culture": "Team Dynamics",
    "Process": "Agile Methodologies",
}


# Consolidate tags based on the mapping
def consolidate_tags(tags, mapping):
    consolidated = set()
    for tag in tags:
        consolidated.add(mapping.get(tag, tag))
    return list(consolidated)

# Update the tags in the JSON
for topic in data:
    for question in topic["questions"]:
        question["tags"] = consolidate_tags(question["tags"], tag_mapping)

# Save the updated JSON back to a file for review
updated_file_path = "updated_questions.json"
with open(updated_file_path, "w") as updated_file:
    json.dump(data, updated_file, indent=2)


