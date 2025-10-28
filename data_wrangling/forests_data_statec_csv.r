forest_data_prep <- function() {
  
  # Load forest data
  df <- read.csv("C:/Users/ZheNe997/Desktop/Hackaton 2025/raw_data/forests_commune_statec.csv")
  
  # Filter rows
  df <- df[df$SPECIFICATION == "C2", ]
  df <- df[!grepl("^CT", df$GEO), ]
  df <- df[df$GEO != "LU", ]
  
  # Keep only relevant columns
  # Adjust column names to match exactly those in the CSV file
  df1 <- df[, c("STRUCTURE_NAME", "GEO", "Geography", "SPECIFICATION", "TIME_PERIOD", "OBS_VALUE")]
  
  # Load population codes
  df_codes <- read.csv("C:/Users/ZheNe997/Desktop/Hackaton 2025/raw_data/population_per_commune.csv")
  df_codes <- df_codes[, c("geographic.level", "geo_id")]
  df_codes <- unique(df_codes)
  
  # Merge datasets
  df_merged <- merge(df_codes, df1, by.x = "geographic.level", by.y = "Geography", all = TRUE)
  
  
  write.csv(df_merged, "C:/Users/ZheNe997/Desktop/Hackaton 2025/ready_data/forests_per_commune.csv")
  
  return(df_merged)
}

d <- forest_data_prep()
head(d)

