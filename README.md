## STATEC Hackathon 2025

**An aging population — but can everyone access key services?**

---

### 🧭 Overview
An interactive map allowing you to see at a glance the location of service providers for the elderly in combination with the population density by municipality of the to-be-discussed age ranges in Luxembourg. 

![(Screenshot of the dashboard)](../manual_data_imports/dashboard_screenshot.png)

**Repository:** [GitHub repo link](https://github.com/xkamphaus/STATEC_hackathon_2025)

---

### 👥 Team Members
| Name | Affiliation | 
|------|------|
| Daniel MICHULKE | MENEJ-SCRIPT |
| Nevena ZHELYAZKOVA | MENEJ-SCRIPT | 
| Nour BOUZAHZAH | MENEJ | 
| Xavier KAMPHAUS | MENEJ-SCRIPT | 
| Zeno PERACCHIONE | MENEJ-SCRIPT | 

---

### **Problem Statement**

- Data on elderly populations and local services is scattered across multiple sources, making analysis and planning difficult.  
- Policymakers and communities lack a unified view of how well services meet the needs of residents aged 65+.  
- There is no simple, interactive tool to visualize demographic and service data across municipalities.  
- This limits data-driven decisions in healthcare access, social inclusion, and urban planning.  

**Solution:**  
An **interactive web map** built with open government data and geospatial tools, showing:  
- 👵 Share of residents 65+ (with gender distribution)  
- 💊 Pharmacies  
- 🏥 Hospitals  
- 🤝 Senior clubs  

- Possibilities for further extension: access to green areas, GP offices, physiotherapists, activities, etc. 

This tool integrates key public datasets to support smarter, more equitable planning for aging populations.

**Intended audience**
- Senior citizens and their family members (to see locations of key services)
- People of any age planning their retirement (for example to purchase retirement property)
- Policy makers to get a quick view on distribution and availability of key services. 

---

### Instructions to visualize the dashboard

- clone the repository and save it in a directoy (e.g. 'your_repo_dir_path')
    - you can download it manually:
    - or, with git, run in command line:
        - cd 'your_repo_dir_path' (to set your directory path)
        - git clone https://github.com/xkamphaus/STATEC_hackathon_2025.git (to save all repo files in your directory)

- install python (saved in 'your_python_dir_path')

- run in command line:
    - cd 'your_repo_dir_path'/statec_hackathon_2025/ (to set the directory where the repository is cloned)
    - 'your_python_dir_path'/python.exe -m http.server 8000 (this opens the instance to host the website locally)

- open a webbrowser and go to the url: http://127.0.0.1:8000/

---

### Technical aspects 

- Data sources: Government open data (population, service providers)​ (details can be found here: './docs/data_sources.md')

- Development tools:​

    - Mapping: Leaflet / Mapbox​

    - Data processing: Python / R​

    - Front-end: HTML/CSS/JavaScript

- Innovation:​

First map in Luxembourg combining age distribution + service locations​

Easy to expand (add more services, filters, or metrics)​

---

### Why the Map Matters & What’s Next​

- Policy information

    - Identify underserved areas → support planning​

    - Improve accessibility for seniors​

- Future possibilities:​

    - Add public transport routes, community centers​

    - Predictive modeling for population aging trends​

    - Mobile-friendly interface for citizens
