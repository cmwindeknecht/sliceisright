package com.SliceIsRight;

public class Constants {
    public static final String ADMIN_PRIVILEGES = "Admin";
    public static final long ADMIN_TOKEN_DURATION = 720L; // 12 hours
    public static final String USER_PRIVILEGES  = "User";
    public static final long USER_TOKEN_DURATION = 60L; // 1 hour
    
    public static final String ENV_ADMIN_SETUP_TOKEN = "ADMIN_SETUP_TOKEN";
    public static final String ENV_JWT_SIGNING_KEY = "JWT_SIGNING_KEY";
    
    public static final String HEADER_ADMIN_SETUP_TOKEN = "X-Admin-Setup-Token";

    public enum Size {
        NONE("None"),
        S("Small"),
        M("Medium"),
        L("Large"),
        XL("X-Large");
        
        private final String value;
        
        Size(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
    }

    public enum MenuItemCategory {
        PIZZAS("Pizzas"),
        SUBS("Subs"),
        APPETIZERS("Appetizers"),
        DESSERTS("Desserts"),
        BEVERAGES("Beverages"),
        DEALS("Deals"); // TODO remove this - just make a isDeal button / column / etc.  Fucks up orderTime calculation

        private final String value;
        
        MenuItemCategory(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
    }

    public enum IngredientCategory {
        MEAT("Meat"),
        VEGETABLE("Vegetable"),
        FRUIT("Fruit"),
        OTHER("Other");

        private final String value;
        
        IngredientCategory(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
    }

    public enum OrderStatus {
        PLACED("Placed"),
        IN_PROGRESS("In Progress"),
        READY("Ready"),
        PICKED_UP("Picked up");
        
        private final String value;
        
        OrderStatus(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
    }

    public enum DayOfWeek {
        MONDAY,
        TUESDAY,
        WEDNESDAY,
        THURSDAY,
        FRIDAY,
        SATURDAY,
        SUNDAY
    }
}
