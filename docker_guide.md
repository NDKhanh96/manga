docker run --name postgres -e POSTGRES_PASSWORD=123456 -p 5432:5432 -d postgres:15.0
để tạo container, hiện đã tạo xong

docker ps: xem các container đang chạy
docker ps -a: xem các container đã khởi tạo bất kể có đang chạy hay không

docker start postgres: để chạy container tên là postgres
docker stop postgres: để dừng container tên là postgres
docker rm postgres: để xoá container tên là postgres
nếu không muốn dùng tên thì có thể dùng container id


ví dụ: docker exec -it postgres psql -U postgres -c "\l"
docker exec -it postgres: để chạy 1 lệnh trong container postgres
psql -U postgres: Khởi động công cụ dòng lệnh psql với tài khoản postgres
-c "\l": Chạy lệnh \l trong psql, lệnh này sẽ liệt kê tất cả các cơ sở dữ liệu

ví dụ 2:
docker exec -it postgres psql -U postgres -c "CREATE DATABASE manga"
lệnh trên sẽ tạo 1 database tên manga

docker exec -it postgres psql -U postgres -d manga
lệnh trên sẽ kết nối với với db manga (kiểu use manga trong mysql), nếu db chưa tồn tại thì sẽ tự động tạo
\dt: show tables
