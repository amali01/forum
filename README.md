<h1 align="center">Forum "4um"</h1>


<p align="center">
    <img src="./static/assets/forumReadmeLogo.png" alt="F.logo" />
</p>


<h2 align="">About The Project</h2>

<h4 >
Welcome to our Web Forum Project!

This project is all about building a user-friendly web forum where users can communicate through sharing posts, comments and interact by liking and disliking. We use cool technologies like SQLite for storing data, Docker to keep things organized, and Go to make it all work seamlessly. while also using essential concepts such as session management, encryption, and database manipulation. By adhering to best practices and incorporating essential packages like bcrypt and UUID.

Let's dive in and explore the exciting world of forums, where users connect, share, and engage in meaningful discussions!
</h4>

## Table of Contents

- [Getting Started](#getting-started)
- [Usage](#usage)
- [Directory Structure](#directory-structure)
- [Screenshots](#screenshots)
- [Authors](#authors)

## Getting Started
You can run the Lem-In project with the following command:
```console
git clone https://learn.reboot01.com/git/malsamma/forum
cd forum
```

## Usage
_make sure you are in project directory_

```
go run . cmd/main.go
```
1. Open http://localhost:8080/ in a browser .
2. start going thro the website as a Gust or u singup to contene as user  . 

### Directory Structure
```console
─ forum/
│
├── api/
│   ├── login.go
│   └── ...
│
├── cmd/
│   └── main.go
│
├── controllers/
│   ├── homepage.go
│   ├── postPage.go
│   └── ...
│
├── funcs/
│   ├── category.go
│   ├── comment.go
│   └── ...
│
├── hashing/
│   └── hashing.go
│
├── static/
│   ├── myInfo.go
│   ├── myFlags.go
│   └── ...
│
├── static/
│   ├── myInfo.go
│   ├── myFlags.go
│   └── ...
|
├── go.mod
├── readme.md
└── ...
```

## Screenshots
### Posts
```

pic from the website once done 
```
### Comment
```

pic from the website once done 
```


## Instructions
- 

## Additional information
- The project is written in Go.
- The Database used is SQLite.
- Allowed packages:
    - All standard Go packages.
    - sqlite3 
    - bcrypt
    - UUID


## Authors
- emahfood 
- amali 
- malsamma
- sahmed
- akhaled