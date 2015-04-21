var _ = require("underscore");
var Utils = require("superscript/lib/utils");
var userPlugin = require("superscript/plugins/user");
var Color = require("color");
var toHex = require('colornames');


exports.changeTint = function(cb) {
  var that = this;
  var newColor;

  userPlugin.get.call(that, "currentColor", function(err, currentColor) {
    var color = Color(currentColor);
    
    if (that.message.adjectives.indexOf("lighter") !== -1) {
      newColor = color.lighten(0.5);
    } else if (that.message.adjectives.indexOf("darker") !== -1) {
      newColor = color.darken(0.5);
    }
    
    that.message.props['color'] = newColor.hexString();
    userPlugin.save.call(that, "currentColor", newColor.hexString(), function() {
      cb(null, "");
    });
  });
};

exports.getRanomColor = function(cb) {
  var r,g,b, that = this;
  r = Utils.getRandomInt(0,255);
  g = Utils.getRandomInt(0,255);
  b = Utils.getRandomInt(0,255);

  var newColor = Color().rgb(r,g,b);
  that.message.props['color'] = newColor.hexString();

  userPlugin.save.call(that, "currentColor", newColor.hexString(), function() {
    cb(null, "How about this?");
  });
};

exports.colorLookup2 = function(color, cb) {
  var that = this;
  var facts = that.facts.db;
  
  facts.get({ object: color, predicate:'color'}, function(err, list) {
    if (!_.isEmpty(list) || toHex.get(color) !== undefined) {
      var colorHex = toHex(color);
      that.message.props['color'] = colorHex;
      userPlugin.save.call(that, "currentColor", colorHex, function(){
        cb(null, color + " is a great. This shade?");
      });
    } else {
      cb(null, "That isn't a color");
    }
  });
};

exports.colorLookup = function(cb) {
  var that = this;
  var message = this.message;
  var things = message.entities.filter(function(item) { if (item !== "color") return item; });
  var suggest = "";
  var facts = that.facts.db;
  var userfacts = that.user.memory.db;
  var botfacts = that.botfacts.db;
  var userID = that.user.name;

  // TODO: This could be improved adjectives may be empty
  var thing = (things.length == 1) ? things[0] : message.adjectives[0];

  if(thing !== "" && message.pnouns.length === 0) {

    // What else is green (AKA Example of green) OR
    // What color is a tree?

    var fthing = thing.toLowerCase().replace(" ", "_");

    // ISA on thing
    facts.get({ object: fthing, predicate:'color'}, function(err, list) {
      if (!_.isEmpty(list)) {
        var thingOfColor = Utils.pickItem(list);
        var toc = thingOfColor.subject.replace(/_/g, " ");

        cb(null, Utils.makeSentense(Utils.indefiniteArticlerize(toc) + " is " + fthing));
      } else {
        facts.get({ subject: fthing, predicate:'color'}, function(err, list) {
          if (!_.isEmpty(list)) {
            that.message.props['color'] = list[0].object;
            cb(null, "Let me show you.");
          } else {

            that.cnet.resolveFact("color", thing, function(err, res){
              that.message.props['color'] = res;
              if (res) {
                suggest = "Let me show you.";
              } else {
                suggest = "";
              }
              cb(null, suggest);
            });
          }
        });
      }
    });

  } else if (message.pronouns.length !== 0){
    // Your or My color?
    // TODO: Lookup a saved or cached value.
    
    // what color is my car
    // what is my favoirute color
    if (message.pronouns.indexOf("my") != -1) {

      // my car is x
      userfacts.get({subject:message.nouns[1],  predicate: userID}, function(err, list) {
        
        if (!_.isEmpty(list)) {
          var color = list[0].object;
          var lookup = message.nouns[1];
          var toSay = ["Your " + lookup + " is " + color + "."];

          facts.get({object:color,  predicate: 'color'}, function(err, list) {
            if (!_.isEmpty(list)) {
              var thingOfColor = Utils.pickItem(list);
              var toc = thingOfColor.subject.replace(/_/g, " ");
              toSay.push("Your " + lookup + " is the same color as a " + toc + ".");
            }
            cb(null, Utils.pickItem(toSay));
          });
        } else {
          // my fav color - we need 
          var pred = message.entities[0];
          userfacts.get({subject: thing,  predicate: pred }, function(err, list) {
            
            if (!_.isEmpty(list)) {
              var color = list[0].object;
              cb(null,"Your " + thing + " " + pred + " is " + color + ".");
            } else {
              cb(null,"You never told me what color your " + thing + " is.");
            }
          });
        }
      });
    }
  } else {
    that.message.props['color'] = "green";
    cb(null, "It is blue-green in color.");
  }
};