#!/usr/bin/env python3
import requests
import yaml
import os
import sys


def fetch_file(file_url):
    # Use requests to fetch the file from the provided URL

    headers = {"Private-Token": os.getenv("GITLAB_API_TOKEN")}
    response = requests.get(file_url, headers=headers)
    print(response.status_code)
    # Check if the request was successful
    if response.status_code != 200:
        print(headers)
        print(file_url)
        raise Exception(f"Failed to fetch file: {file_url}")
    # Return the content of the file
    return response.text


def mk_file_url(base_url, prj, ref, file):
    return "/".join([base_url, prj, "-", "raw", ref, file])


def process_includes(gitlab_ci_dict, base_url):
    # If the dictionary contains an 'include' key
    if "include" in gitlab_ci_dict:
        # Go through each include
        for include in gitlab_ci_dict["include"]:
            if "local" in include:
                raise Exception("Can't handle local imports")
            elif "project" in include:
                # Construct the URL for the included file
                include_url = mk_file_url(
                    base_url, include["project"], include["ref"], include["file"],
                )
                # Fetch the content of the included file
                include_content = fetch_file(include_url)
                # Parse the content as YAML
                include_dict = yaml.safe_load(include_content)
                # Process includes in the included file
                include_dict = process_includes(include_dict, base_url)
                # Merge the dictionaries
                gitlab_ci_dict = {**gitlab_ci_dict, **include_dict}
        # Remove the 'include' key from the dictionary
        del gitlab_ci_dict["include"]
    # Return the processed dictionary
    return gitlab_ci_dict


# base_url = "https://" + os.getenv("LAB_CORE_HOST")
# The URL of the main .gitlab-ci.yml file
main_file_url = sys.argv[1] if len(sys.argv) > 1 else exit("URL parameter is missing.")
# main_file_url = mk_file_url(
#     base_url, "jackmac92/user-comments", "master", ".gitlab-ci.yml"
# )
# Fetch the content of the main file
main_file_content = fetch_file(main_file_url)
# Parse the content as YAML
main_file_dict = yaml.safe_load(main_file_content)
# Process the includes
main_file_dict = process_includes(main_file_dict, base_url)
# Convert the dictionary back to YAML
main_file_content = yaml.dump(main_file_dict)
# Print the result
print(main_file_content)
