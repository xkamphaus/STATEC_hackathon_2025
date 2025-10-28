library(tidyverse)

file_dir <- "C:/Users/kamxa019/Documents/Code_development/statec_hackathon_2025/assets/"

df <-read.csv2(paste0(file_dir, "structures_hebergement_latlong.csv"))
df_cl <-
  df |>
  mutate(Numero = str_replace(Numero, ",", "."),
         lat = str_replace(lat, ",", "."),
         lon = str_replace(lon, ",", "."))

df_cl_v1 <- df_cl |> filter(Section == "Structures d'hébergement")
write.csv2(df_cl_v1, paste0(file_dir, "hebergements_latlon.csv"), row.names=F)

df_cl_v1 <- df_cl |> filter(Section == "Logements encadrés")
write.csv2(df_cl_v1, paste0(file_dir, "logementsEncadres_latlon.csv"), row.names=F)

df_cl_v1 <- df_cl |> filter(Section == "Centres de jour")
write.csv2(df_cl_v1, paste0(file_dir, "centresJour_latlon.csv"), row.names=F)

df_cl_v1 <- df_cl |> filter(Section == "Clubs Aktiv Plus")
write.csv2(df_cl_v1, paste0(file_dir, "aktivPlus_latlon.csv"), row.names=F)

df_cl_v1 <- df_cl |> filter(Section == "Services activités seniors")
write.csv2(df_cl_v1, paste0(file_dir, "activities_latlon.csv"), row.names=F)

df_cl_v1 <- df_cl |> filter(Section == "Services téléalarme")
write.csv2(df_cl_v1, paste0(file_dir, "alarmes_latlon.csv"), row.names=F)

df <-read.csv(paste0(file_dir, "pharmacies_luxembourg_lu.csv"))
df_cl <-
  df |>
  mutate(lat = str_replace(lat, ",", "."),
         lon = str_replace(lon, ",", "."))

write.csv2(df_cl, paste0(file_dir, "pharmacies_latlon.csv"), row.names = F)

df <- read.csv(paste0(file_dir, "population_per_commune.csv"))
df_cl <- df |> mutate(ratio = str_replace(ratio, ",", "."))
write.csv2(df_cl, paste0(file_dir, "population_statec.csv"), row.names = F)

df <- read.csv(paste0(file_dir, "hospitals_luxembourg.csv"))
df_cl <- df |>
  rename(lat = latitude, lon = longitude) |>
  mutate(lat = as.character(lat),
         lon = as.character(lon))
write.csv2(df_cl, paste0(file_dir, "hospitals_latlon.csv"), row.names = F)
