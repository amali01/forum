FROM golang:1.21.3
WORKDIR /forum
COPY . /forum
RUN go build -v ./cmd/main.go
CMD ./cmd
EXPOSE 8080
LABEL "version"="1.0"
LABEL "project name"="Re4um"
LABEL "description"="This project is all about building a user-friendly web forum where users can communicate through sharing posts, comments and interact by liking and disliking. We use cool technologies like SQLite for storing data, Docker to keep things organized, and Go to make it all work seamlessly. while also using essential concepts such as session management, encryption, and database manipulation. By adhering to best practices and incorporating essential packages like bcrypt and UUID."
LABEL "Author"="emahfood, amali, malsamma, sahmed, akhaled"
