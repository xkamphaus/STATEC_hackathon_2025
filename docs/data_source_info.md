## Data Sources for the Statec Hackathon Project 2025  

Topic: Aging population in Luxembourg

### Population structure by age and gender for each municipality in Luxembourg

Source: STATEC 

LUSTAT Data Explorer: • Population by canton and municipality, sex and age 

Limitations: Data is available only for 2021. Due to absence of labels we did not use API download but manual Export to csv.  

Transformations: We used the data to compute % of persons over 65 in each commune and then the gender distribution  

Purpose: to show the geographical distribution of aged persons by gender and as a share of the population in the municipality. 


### Hospital locations in Luxembourg  

SOURCE: OpenStreetMap, and a Python script to extract the addresses and geo-coordinates of hospital structures in Luxembourg.  

Purpose: to be able to show the locations of hospital structures in Luxembourg. Data extracted from OpenStreetMap after September 2012 is licensed on terms of the Open Database License, "ODbL" 1.0, previously it was licensed CC-BY-SA 2.0. 


### Pharmacies locations in Luxembourg  

SOURCE: OpenStreetMap, and a Python script to extract the addresses and geo-coordinates of pharmacies in Luxembourg.  

Purpose: to be able to show the locations of pharmacies in Luxembourg.  

Data extracted from OpenStreetMap after September 2012 is licensed on terms of the Open Database License, "ODbL" 1.0, previously it was licensed CC-BY-SA 2.0. 


### Locations of elederly care facilities in Luxembourg in 2019 and 2024  

SOURCE: MFSVA (Ministry of Family Affairs, Solidarity, Living Together and Reception of Refugees) 

Ministère de la Famille, des Solidarités, du Vivre ensemble et de l’Accueil (Luxembourg). (2024, April). Relevé des services pour personnes âgées au Luxembourg. Retrieved from https://mfsva.gouvernement.lu/dam-assets/publications/annuaire-releve/relevepa/Releve-des-services-agrees-pour-personnes-agees-ACC.pdf 

Transformations: we used the pdf to obtain the addresses of the structures providing services for Senior citizens and transformed the data to tabular format using a Python function available in the git repository. As a second step we passed the list of addresses through another Python function to obtain the geo coordinates of each address.  

Purpose: to show the geographical locations of the different structures providing services for Senior citizens in Luxembourg.  
