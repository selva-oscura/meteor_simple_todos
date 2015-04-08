Tasks = new Mongo.Collection('tasks');

if (Meteor.isClient) {
  // This code only runs in the client
  Template.body.helpers({
    tasks: function(){
      return Tasks.find({}, {sort:{createdAt: -1}});
    }
  });
  Template.body.events({
    "submit .new-task": function(event){
      // this funciton is called when the new-task form is submitted
      var text = event.target.text.value;
      Tasks.insert({
        text: text,
        createdAt: new Date() // current time
      });
      //clear form
      event.target.text.value="";
      //prevent default form submit
      return false;
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
