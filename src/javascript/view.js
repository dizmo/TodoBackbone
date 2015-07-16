// Renders individual todo items list (li)
app.todoList = new app.TodoList();
// renders individual todo items list (li)
app.TodoView = Backbone.View.extend({
    tagName: 'li',
    template: _.template($('#item-template').html()),
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        //this.$el.toggleClass('done', this.model.get('completed'));
        this.input = this.$('.edit');
        setTimeout(function(){
            // initialize dizmo elements
            DizmoElements(".toggle").dcheckbox();
            DizmoElements(".edit").dinput();
            DizmoElements(".destroy").dbutton();
        },50);


        return this; // enable chained calls
    },
    initialize: function(){
        this.model.on('change', this.render, this);
        this.model.on('destroy', this.remove, this);
    },
    events: {
        'click label' : 'edit',
        'keypress .edit' : 'updateOnEnter',
        'blur .edit' : 'close',
        'click .toggle': 'toggleCompleted',
        'click .destroy': 'destroy'
    },
    edit: function(){
        this.$el.addClass('editing');
        this.input.focus();
    },
    close: function() {
        var value = this.input.val().trim();
        if (!value) {
            this.clear();
        } else {
            this.model.save({title: value});
            this.$el.removeClass("editing");
        }
    },
    updateOnEnter: function(e){
        if(e.which == 13){
            this.close();
        }
    },
    toggleCompleted: function(){
        this.model.toggle();
    },
    destroy: function(){
        DizmoElements('#listdiv').dlist('update');
        this.model.destroy();
    }
});

// renders the full list of todo items calling TodoView for each one.
app.AppView = Backbone.View.extend({
    el: '#front',
    initialize: function () {
        this.input = this.$('#new-todo');
        // when new elements are added to the collection render then with addOne
        app.todoList.on('add', this.addOne, this);
        app.todoList.on('reset', this.addAll, this);
        this.main = this.$('#main');
        this.actions = this.$('#actions');
        app.todoList.fetch(); // Loads list from local storage
        DizmoElements('#listdiv').dlist('update');
        // create scrollbar
        if (this.iscroll !== undefined) {
            this.iscroll.dlist('create');
        } else {
            this.iscroll = DizmoElements('#listdiv');
            this.iscroll.dlist();
        }
    },
    events: {
        'keypress #new-todo': 'createTodoOnEnter',
        'click #clear-completed': 'clearCompleted',
        "click #clear-all": "clearAll"
    },
    createTodoOnEnter: function(e){
        if ( e.which !== 13 || !this.input.val().trim() ) { // ENTER_KEY = 13
            return;
        }
        app.todoList.create(this.newAttributes());
        this.input.val(''); // clean input box
    },
    addOne: function(todo){
        var view = new app.TodoView({model: todo});
        $('#todo-list').append(view.render().el);

        DizmoElements('#listdiv').dlist('update');
    },
    addAll: function(){
        this.$('#todo-list').html(''); // clean the todo list
        app.todoList.each(this.addOne, this);
    },
    newAttributes: function(){
        return {
            title: this.input.val().trim(),
            completed: false
        };
    },
    clearCompleted: function() {
        _.invoke(app.todoList.completed(), 'destroy');
        return false;
    },

    clearAll: function() {
        _.invoke(app.todoList.toArray(), 'destroy');
        return false;
    }
});
