# bamazon
### Description
Bamazon is a Node based application to handle purchasing, inventory management, and reporting for products and departments at "Bamazon".

### How To
* For Customers:
Run `Node bamazonCustomer.js`. It will display a list of items for purchase and prompt you to enter the ID of the product you want. It will then prompt for a quantity showing how many are in stock and process the order displaying how many you ordered and the total price charged.
* For Managers:
Run `Node bamazonManager.js`. It will display a menu of items to choose from.
    * View Products for Sale - will display a list of all products for sale.
    * View Low Inventory - will display a list of products that have 5 or less items in inventory.
    * Add to Inventory - will allow you to select the ID of a product and add additional inventory into the system.
    * Add New Product - will allow you to add a new product to the list. You will need to enter its name, department assigned, cost, and inventory count.
* For Supervisors:
Run `Node bamazonSupervisor.js`. It will display a menu of items to choose from.
    * View Product Sales by Department - will display a list of all departments and the sales for each. It will calculate the total profit taking into account the overhead cost of the department.
    * Create New Department - will allow you create a new department. You will need to enter the department name and overhead costs.

