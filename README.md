# Test Arena

**Test Arena** is an online platform designed to help users enhance their coding skills by solving and practicing a variety of well-crafted problems. The platform also allows users to contribute by creating and submitting high-quality problems, which are reviewed and approved by admins through a dedicated admin panel.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Screenshots](#screenshots)
- [Contact](#contact)

## Features
- **Problem Solving**: Users can solve a wide range of coding problems to improve their skills.
- **Problem Submission**: Users can create and submit new coding problems for others to solve.
- **Admin Panel**: Admins have the ability to review, approve, or reject submitted problems.
- **Secure Code Execution**: Utilizes Docker to execute code securely in an isolated environment.
- **User Authentication**: Secure login and registration system with JWT-based authentication.

## Technology Stack
- **Backend**: Spring Boot
- **Containerization**: Docker
- **Database**: MySQL
- **Frontend**: HTML, CSS, JavaScript
- **Version Control**: Git

## Getting Started
To get a local copy up and running, follow these simple steps.

### Prerequisites
- Java 11 or higher
- Maven
- Docker
- MySQL

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/diwanshu-kumar/test-arena.git
   cd test-arena

2. Set up the database
    ```bash
   CREATE DATABASE test_arena;

3. Configure your MySQL database in application.properties:
    ```bash
   spring.datasource.url=jdbc:mysql://localhost:3306/test_arena
   spring.datasource.username=your_username
   spring.datasource.password=your_password

4. Build and run the backend:
   ```bash
   mvn clean install
    mvn spring-boot:run

5. There is some docker files for each code runner you can find it in docker folder in root of project.
   you should build it separately to run or submit solution for a problem.

### Front-End
   Now for front-end just clone this repo and open the **index.html** page.
   ```
      git clone https://github.com/diwanshu-kumar/test-arena-front-end.git
      cd test-arena-front-end
   ```

## Screenshots
![1](https://github.com/user-attachments/assets/fd342bfd-a9ea-4082-be6c-95009ecff69c)
![2](https://github.com/user-attachments/assets/5d207dfe-d62b-4bdf-b1ac-379a9f8e481c)
![3](https://github.com/user-attachments/assets/b86e5d5e-eff2-4325-9002-9ecc8da49795)
![4](https://github.com/user-attachments/assets/6491ecf8-63ab-4448-bfad-1c1bccf06374)
### Submission Results
![5](https://github.com/user-attachments/assets/c37e426b-690e-4b04-b251-b46cfca1cc2e)
### all the submission of particular user
![6](https://github.com/user-attachments/assets/dcf740e8-0487-4591-bee1-622945d0299f)

### see the individual submissions
![7](https://github.com/user-attachments/assets/5ba62d7a-0689-45c6-81de-e91a7bb049f2)

### Create new Problem
![8](https://github.com/user-attachments/assets/77dfca13-759c-49be-a493-3fe630b2da96)

### Add system test case
![9](https://github.com/user-attachments/assets/fcd322ef-bd63-4258-8735-dfafce061f30)

### admin panel
![10](https://github.com/user-attachments/assets/a2a5f1ec-ea2f-4fe4-8be9-5211bece27ef)
![11](https://github.com/user-attachments/assets/88ef6b7b-d85f-4f75-aba0-99a36fe1e013)
![12](https://github.com/user-attachments/assets/6afc203b-ecb1-4efc-9c06-704b8b6de975)


## Contact
   - email : kumardiwanshu00@gmail.com
   - linkedin : [diwanshu-kumar](linkedin.com/in/diwanshu-kumar-536793215/)
