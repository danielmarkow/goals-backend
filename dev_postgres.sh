# pw via command line argument
docker run --name postgresql -e POSTGRES_USER=goalsuser -e POSTGRES_PASSWORD=$1 -p 5432:5432 -d postgres