// Todo Collection
// The collection of todos are store in the dizmo data tree

app.TodoList = Backbone.Collection.extend({
    model: app.Todo,
    localStorage: new Store("backbone-todo"),
    completed: function() {
        return this.where({completed: true}
        );
    },
    remaining: function () {
        return this.where({completed: false});
    }
});