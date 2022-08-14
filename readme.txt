to run in local  -- install latest version of nodejs

run - npm install 
to run server   npm run dev





Created three models --  User, Order, Milk

user  --  email, password (both required)
Milk  --  quantity, quantityRemaining, pricePerLire , createdAt,updatedAt (All fields are rquired)
Order --  quantity, userId, totalPrice(filled at the time of ordering)


API

For Adding Milk   /api/milk/add (POST)
for checking milk capacity   :  /api/checkCapacity/date(date to be filled)

For order   /api/Order/add  - user should be logged in to order
for update order  /api/order/update/id

for updateStatus  /api/order/updateStatus/id  
for delete   /api/order/delete/id


For SignIn    /api/user/login
For Signup     /api/user/signup



deployedApp ID  https://koreaisanjay.herokuapp.com/

