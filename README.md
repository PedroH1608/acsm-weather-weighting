# WIP - ACSM Weather Weighting Calculator

## Overview

This tool is designed to calculate weather weights for simulations based on real-world historical weather data. By providing a location, it fetches the last 90 days of weather information and calculates appropriate weightings for various weather conditions, such as sunny, cloudy, rainy, and low visibility scenarios.

## For Assetto Corsa Server Manager

This tool was specifically developed for use with the **Emperor Servers' Assetto Corsa Server Manager (ACSM)**. The generated weights are intended to be used with the "Custom Shaders Patch with transitions (Weighted Random)" weather type in ACSM.

### Weighted Random Mode

In Weighted Random mode, each weather preset is given a weighting, which makes the weather more likely to be selected by the random progression system. In this mode, you cannot configure weather order, duration, or transition duration; all of these are automatically configured by the random progression system.