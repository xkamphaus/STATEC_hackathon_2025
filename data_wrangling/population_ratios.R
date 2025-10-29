library(tidyverse)

# global variables

age_group_60 <- c("Y60T64", "Y65T69", "Y70T74", "Y75T79",
                  "Y80T84", "Y85T89", "Y90T94", "Y95T99", "Y_GE100")
age_group_70 <- c("Y70T74", "Y75T79", "Y80T84", "Y85T89", "Y90T94", "Y95T99", "Y_GE100")
age_group_80 <- c("Y80T84", "Y85T89", "Y90T94", "Y95T99", "Y_GE100")
age_group_90 <- c("Y90T94", "Y95T99", "Y_GE100")
file_input <- "../assets/LU1,DSD_CENSUS_GROUP1_3@DF_B1607,1.0+all.csv"
file_output <- "../assets/population_statec.csv"

# data import

df_data <- read.csv(file_input)

df_data_w_geo <-
  df_data |>
  mutate(geo_id = case_when(str_length(GEO) == 2 ~ GEO,
                            str_length(GEO) == 7 ~ str_sub(GEO, -2, -1),
                            str_length(GEO) == 9 ~ str_sub(GEO, -4, -1))) |>
  select(TIME_PERIOD, geo_id, Geographic.level, AGE, Age.class, Sex, OBS_VALUE) |>
  distinct()

df_data_w_age_groups <-
  df_data_w_geo |>
  # 60+ age group:
  bind_rows(df_data_w_geo |>
              filter(AGE %in% age_group_60) |>
              group_by(TIME_PERIOD, geo_id, Geographic.level, Sex) |>
              summarise(OBS_VALUE = sum(OBS_VALUE, na.rm=T)) |>
              ungroup() |>
              mutate(AGE = "Y_GE60",
                     Age.class = "60 years or over")) |>
  # 70+ age group:
  bind_rows(df_data_w_geo |>
              filter(AGE %in% age_group_70) |>
              group_by(TIME_PERIOD, geo_id, Geographic.level, Sex) |>
              summarise(OBS_VALUE = sum(OBS_VALUE, na.rm=T)) |>
              ungroup() |>
              mutate(AGE = "Y_GE70",
                     Age.class = "70 years or over")) |>
  # 80+ age group:
  bind_rows(df_data_w_geo |>
              filter(AGE %in% age_group_80) |>
              group_by(TIME_PERIOD, geo_id, Geographic.level, Sex) |>
              summarise(OBS_VALUE = sum(OBS_VALUE, na.rm=T)) |>
              ungroup() |>
              mutate(AGE = "Y_GE80",
                     Age.class = "80 years or over")) |>
  # 90+ age group:
  bind_rows(df_data_w_geo |>
              filter(AGE %in% age_group_90) |>
              group_by(TIME_PERIOD, geo_id, Geographic.level, Sex) |>
              summarise(OBS_VALUE = sum(OBS_VALUE, na.rm=T)) |>
              ungroup() |>
              mutate(AGE = "Y_GE90",
                     Age.class = "90 years or over"))

df_ratios <-
  df_data_w_age_groups |>
  left_join(df_data_w_age_groups |>
              filter(AGE == "_T" & Sex == "Total") |>
              select(-c(AGE, Age.class, Sex)) |>
              rename(POP_OBS_VALUE = OBS_VALUE),
            by = c("TIME_PERIOD", "geo_id", "Geographic.level")) |>
  left_join(df_data_w_age_groups |>
              filter(Sex == "Total") |>
              select(-c(Sex, Age.class)) |>
              rename(POP_AGE_OBS_VALUE = OBS_VALUE),
            by = c("TIME_PERIOD", "geo_id", "Geographic.level", "AGE")) |>
  mutate(ratio = ifelse(Sex == "Total",
                        round(100.0 * OBS_VALUE/POP_OBS_VALUE, 1),
                        round(100.0 * OBS_VALUE/POP_AGE_OBS_VALUE, 1))) |>
  rename_with(tolower)

write.csv(df_ratios, file_output, row.names = F, sep=";")
