var app = {}; // create namespace for our app

//Define a Todo model
app.Todo = Backbone.Model.extend({

    //Default attributes for the todo item.
    defaults: {
        title: '',
        completed: false
    },
    toggle: function(){
        this.save({ completed: !this.get('completed')});
    }
});