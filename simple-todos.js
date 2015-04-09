Tasks = new Mongo.Collection('tasks');

if (Meteor.isClient) {
  // This code only runs in the client
  Template.body.helpers({
    tasks: function(){
      if(Session.get('hideCompleted')){
        return Tasks.find({checked: {$ne: true}}, {sort:{createdAt: -1}});        
      }else{
        return Tasks.find({}, {sort:{createdAt: -1}});
      }
    },
    hideCompleted: function(){
      return Session.get("hideCompleted");
    },
    incompleteCount: function(){
      return Tasks.find({checked: {$ne: true}}).count();
    }
  });
  Template.body.events({
    "submit .new-task": function(event){
      // this function is called when the new-task form is submitted
      var text = event.target.text.value;

      // deprecated after removal of insecure module
      // Tasks.insert({
      //   text: text,
      //   createdAt: new Date(),              // current time
      //   owner: Meteor.userId(),             // _id of logged-in user
      //   username: Meteor.user().username    // username of logged-in user
      // });
      // end deprecated after removal of insecure module

      Meteor.call("addTask", text);

      //clear form
      event.target.text.value="";
      //prevent default form submit
      return false;
    },
    "change .hide-completed input": function(event){
      Session.set("hideCompleted", event.target.checked);
    }
  });
  Template.task.events({
    "click .toggle-checked": function(){
      // set the checked property to the opposite of its current value
      // deprecated after removal of insecure module
      // Tasks.update(this._id, {$set: {checked: ! this.checked}});
      // end deprecated after removal of insecure module
      Meteor.call('setChecked', this._id, ! this.checked);
    },
    "click .delete": function(){
      // deprecated after removal of insecure module
      // Tasks.remove(this._id);
      // end deprecated after removal of insecure module
      Meteor.call("deleteTask", (this._id));
    }
  });
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.methods({
    addTask: function(text){
      // Make sure user is logged in before inserting a task
      if(!Meteor.userId()){
        throw new Meteor.Error('not-authorized');
      }
      Tasks.insert({
        text: text,
        createdAt: new Date(),
        owner: Meteor.userId(),
        username: Meteor.user().username
      });
    },
    deleteTask: function(taskId){
      Tasks.remove(taskId);
    },
    setChecked: function(taskId, setChecked){
      Tasks.update(taskId, { $set: { checked: setChecked} });
    }
  })
}
