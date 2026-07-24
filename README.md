## Overview

To build a full-stack Learning Management System (LMS) where students can enroll in
courses, The project will involve building a Django backend, creating an API with Django
Rest Framework, and integrating a React frontend, using SQLite as the database. This
project demonstrates your understanding and application of Python, Django, SQL,
JavaScript, and React, along with HTML and CSS for structure and styling.

A simple full-stack Django-based learning management system project, using SQLite as the database.
While using Rest Framework and a React frontend along with HTML and CSS for structure and styling.

## Introduction

- WIP

## User Stories

- WIP

## Features

To be added:

Students:

- Can browse available courses
- Enroll and access a list of courses they are enrolled in
- Signup, Login and logout

Teachers:

- Can create and manage courses

Admins:

- Can create and manage courses, as well as manage users

* WIP

## Technologies Used

VSCode was used as my main tool in order to write/edit code
Git was used to deal with the version control of my website
GitHub was used to host the code of my website
HTML was used as the foundation/structure of my site
CSS was used to style and edit the layout of my site
Django

- WIP

## Validation

- WIP

## Accessibility

## Deployment

- WIP

## Credits

- WIP

TO Do:

Key Elements:
• Courses: Courses consist of a title and description.
• User Roles and Authentication: Implement user registration, login, and role-based
access control. The functionality that each role has access to is listed above in the
overview.
• REST API: Develop REST endpoints using Django Rest Framework (DRF) to handle
data interactions between the frontend and backend.
• Testing: Write automated tests for your React components and Django API
methods
• Documentation: Include thorough documentation (README). This should include
your front-end wireframes, technical explanations of how your application works
under the hood, how to set up and run the application locally, and how to run the
tests.

from getpass import getpass

# Placeholder user credentials for

demonstration
USERNAME = "user123"
PASSWORD = "securepass"
username_input = input("Enter your
username: ")
password_input = getpass("Enter your
password: ")
if username_input == USERNAME and
password_input == PASSWORD:
print("Access granted.")
else:
print("Access denied.")

// Example of authorization check
const user = {
role: 'admin',
permissions: ['view-dashboard', 'edituser'],
};
function authorize(action) {
if (user.permissions.includes(action))
{
return `Access granted for
${action}`;
} else {
return `Access denied for
${action}`;
}
}
console.log(authorize('edit-user')); //
Outputs: Access granted for edit-user
console.log(authorize('delete-user'));
// Outputs: Access denied for deleteuser
