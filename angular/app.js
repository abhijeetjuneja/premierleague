//Declare the module\
var app=angular.module('footballApp',['ngRoute']).
run(function() {
    FastClick.attach(document.body);
  });

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    };
});

//Declare service for lists for the two json files
app.service('detailService', function() {
    var matchdetail="";
    var list1={id:1};
    var list2={id:2};
    var list={};
    var bg=0;
    return {list1:list1,
    list2:list2,
  list:list,
  bg:bg};

});

//Declare the main controller and use detailService
app.controller('mainController',['detailService',function(detailService){

  this.value=false;
  var m=this;
  m.bg=detailService.bg;

  //Set background image in index-view
  m.setback=function(bg){
    detailService.bg=bg;

  };

//Identify if touch device and set grayscale if not
  if(is_touch_device())
  {

  }
  else {
          $(".first").mouseover(function() {
            $(this).css('-webkit-filter', 'none');
        }).mouseout(function() {
            $(this).css('-webkit-filter','grayscale(100%)');
        });
        $(".second").mouseover(function() {
          $(this).css('-webkit-filter', 'none');
      }).mouseout(function() {
          $(this).css('-webkit-filter','grayscale(100%)');
      });
  }
  function is_touch_device() {
    return 'ontouchstart' in window        // works on most browsers
        || navigator.maxTouchPoints;       // works on IE10/11 and Surface
    };


  //Update current list according to ng-click
  m.setList=function(id){
          if(id===1)
            detailService.list=detailService.list1;
          else
            detailService.list=detailService.list2;
          console.log(detailService.list);
        };
      this.jumboHide=function(){
      m.value=true;
      };
}]);


//Declare the matches controller
app.controller('matchesController',['$scope','$http','$location','detailService',function($scope,$http,$location,detailService){
  var m=this;

  m.list={};
  m.matches=[];
  this.currentPage = 0;
    this.pageSize = 10;

      this.numberOfPages=function(l){
        console.log("firedlength");
        console.log(l);
        console.log(Math.ceil(l/m.pageSize));
        return Math.ceil(l/m.pageSize);
    };

//First http request
  var url='https://raw.githubusercontent.com/openfootball/football.json/master/2015-16/en.1.json';
    $http.get(url).then(function(data){
    //Set current list
    if(detailService.list===detailService.list1)
    {
      detailService.list=data;
      for(var i in data.data.rounds)
      {
        for(var j in data.data.rounds[i].matches)
        {
          if(data.data.rounds[i].matches[j].score1==null&&data.data.rounds[i].matches[j].score2==null)
          {
            data.data.rounds[i].matches[j].score1=0;
            data.data.rounds[i].matches[j].score2=0;
          }
          else
          m.matches.push(data.data.rounds[i].matches[j]);
        }
      }
      m.list=data;
      m.bg=detailService.bg;
      console.log(data);
      console.log(m.list);
      console.log(m.matches);
      setTeams();
      addYearandMatchday();
      detailService.list1=data;
      
      
    }
    
    },function(data){
        console.log("error");
    });

  //Second http request
  url='https://raw.githubusercontent.com/openfootball/football.json/master/2016-17/en.1.json';
    $http.get(url).then(function(data){
      //Set current list
      if(detailService.list===detailService.list2)
      {
        detailService.list=data;
        for(var i in data.data.rounds)
        {
          for(var j in data.data.rounds[i].matches)
          {
            m.matches.push(data.data.rounds[i].matches[j]);
          }
        }
          m.list=data;
          m.bg=detailService.bg;
          
        setTeams();
        addYearandMatchday();
        detailService.list2=data;

        
      }

  },function(data){
  console.log("error");
  });

  //Add separate fields for year and matchday calculated from given data
   function addYearandMatchday(){
    var j=0;
    var count=1;
    for(var i in m.matches)
    {
      m.matches[i].abc=findYear(m.matches[i].date);
      m.matches[i].goals=findGoals(m.matches[i].score1,m.matches[i].score2);
      if(count>9&&count%10==0)
      {
      m.matches[i].matchday="Matchday"+j;
      console.log(m.matches[i].matchday);
      j++;
      }
      else
      {
        m.matches[i].matchday="Matchday"+j;
        console.log(m.matches[i].matchday);
      }
      count++;
    }
    console.log(m.matches);
    
  }

    function findYear(d){
       
       return d.substring(0,4);
     }
   function findGoals(s1,s2){
     if(s1+s2===0)
     return '0 goals';
     if(s1+s2>0&&s1+s2<4)
     return '3 goals';
     if(s1+s2>3&&s1+s2<7)
     return '6 goals';
     if(s1+s2>6)
     return '>6 goals'
   }

   //Copy list items from service to controller list
  m.setList=function(id){
        if(id===1)
          m.list=detailService.list1;
        else
          m.list=detailService.list2;
         
      };
  m.teams=[];
  //Create teams array in m.teams
   function setTeams(){
        var i=0;
       
        while(detailService.list.data.rounds[0].matches[i])
        {
          m.teams.push(
            detailService.list.data.rounds[0].matches[i].team1.name
          );
            m.teams.push(
              detailService.list.data.rounds[0].matches[i].team2.name
            );
            i++;
        }
        
      }
    m.team="";
    m.id=0;
    m.item="";

    //Check the filter
    m.selected=function(id){
      m.currentPage = 0;
       $(".tabButtons").show();

      m.item="";
      m.id=id;

    };

    //Check the filter entry
    m.filterItem=function(item,id,yearid){
      
     
     
         m.pageSize=10;
        m.currentPage=0;
     
    
        
     
      if(id==1)
      {
      m.item=item.substring(0,4);
      
    console.log(m.item);
    }
      else
      {
        if(id==4)
        {
          
          m.item="Matchday"+item;
          console.log(m.item);
          console.log(m.list);
          console.log(m.matches);
          $(".tabButtons").hide();
        }
        else
    m.item=item;
    }
    };



    //For the detail page
    this.showDetail=function(obj){
        detailService.matchdetail=obj;
        $location.path("/match-detail-view");

      };

}]);


//Declare the detail matches controller
app.controller('detailController',['detailService',function(detailService){
    var m=this;
    m.match=detailService.matchdetail;
    m.bg=detailService.bg;
    m.review="";


    //Back button
    this.goBack =function() {
    window.history.back();
    };

    //Custom comments on a match
    if(m.match.score1>m.match.score2)
    {
      m.review="In the latest installment between "+m.match.team1.name+" and "+m.match.team2.name+" , "+m.match.team1.name+" won the game by "+m.match.score1+"-"+m.match.score2+". It was a great team effort by "+m.match.team1.name+" who showed their quality in the final third. "+m.match.team2.name+" need to improved and bounce back in the next round of matches.";
    }
    if(m.match.score1<m.match.score2)
    {
      m.review="In the latest installment between "+m.match.team1.name+" and "+m.match.team2.name+" , "+m.match.team2.name+" won the game by "+m.match.score1+"-"+m.match.score2+". It was a great team effort by "+m.match.team2.name+" who showed their quality in the final third. "+m.match.team1.name+" need to improved and bounce back in the next round of matches.";
    }
    if(m.match.score1==m.match.score2)
    {
      m.review="In the latest installment between "+m.match.team1.name+" and "+m.match.team2.name+" , "+m.match.team1.name+" and "+m.match.team2.name+" game ended with a "+m.match.score1+"-"+m.match.score2+" draw. Both teams need to be clinical ahead of the next round because these were valuable points dropped."
    }
}]);

//Declare the table controller
app.controller('tableController',['detailService',function(detailService){
  var m=this;
  m.teams=[];
  m.bg=detailService.bg;

  //Back button
    this.goBack =function() {
    window.history.back();
    };

  //Create custom list containing all points and stats
  for (i in detailService.list.data.rounds[0].matches)
  {
    m.teams.push({
      name:detailService.list.data.rounds[0].matches[i].team1.name,
      points:0,
      won:0,
      lost:0,
      draw:0,
      gf:0,
      ga:0,
      gd:0
      });
      m.teams.push({
        name:detailService.list.data.rounds[0].matches[i].team2.name,
        points:0,
        won:0,
        lost:0,
        draw:0,
        gf:0,
        ga:0,
        gd:0
        });
  }
    m.obj=detailService.list.data;


    //Update the above list according to the results
    for(i in m.obj.rounds)
      for(j in m.obj.rounds[i].matches)
      {
        if(m.obj.rounds[i].matches[j].score1>m.obj.rounds[i].matches[j].score2)
        {
          for(k in m.teams)
            {
                if(m.obj.rounds[i].matches[j].team1.name==m.teams[k].name)
                {
                    m.teams[k].points=m.teams[k].points+3;
                    m.teams[k].won=m.teams[k].won+1;
                    m.teams[k].gf=m.teams[k].gf+m.obj.rounds[i].matches[j].score1;
                    m.teams[k].ga=m.teams[k].ga+m.obj.rounds[i].matches[j].score2;
                    m.teams[k].gd=(m.teams[k].gf-m.teams[k].ga);
                }
                if(m.obj.rounds[i].matches[j].team2.name==m.teams[k].name)
                {
                    m.teams[k].lost=m.teams[k].lost+1;
                    m.teams[k].gf=m.teams[k].gf+m.obj.rounds[i].matches[j].score2;
                    m.teams[k].ga=m.teams[k].ga+m.obj.rounds[i].matches[j].score1;
                    m.teams[k].gd=(m.teams[k].gf-m.teams[k].ga);
                }
            }
        }
        if(m.obj.rounds[i].matches[j].score2>m.obj.rounds[i].matches[j].score1)
        {
          for(k in m.teams)
            {
                if(m.obj.rounds[i].matches[j].team1.name==m.teams[k].name)
                {
                    m.teams[k].lost=m.teams[k].lost+1;
                    m.teams[k].gf=m.teams[k].gf+m.obj.rounds[i].matches[j].score1;
                    m.teams[k].ga=m.teams[k].ga+m.obj.rounds[i].matches[j].score2;
                    m.teams[k].gd=(m.teams[k].gf-m.teams[k].ga);
                }
                if(m.obj.rounds[i].matches[j].team2.name==m.teams[k].name)
                {
                  m.teams[k].points=m.teams[k].points+3;
                  m.teams[k].won=m.teams[k].won+1;
                  m.teams[k].gf=m.teams[k].gf+m.obj.rounds[i].matches[j].score2;
                  m.teams[k].ga=m.teams[k].ga+m.obj.rounds[i].matches[j].score1;
                  m.teams[k].gd=(m.teams[k].gf-m.teams[k].ga);
                }
            }
        }
        if(m.obj.rounds[i].matches[j].score2==m.obj.rounds[i].matches[j].score1&&m.obj.rounds[i].matches[j].score1!=null)
        {
          for(k in m.teams)
            {
                if(m.obj.rounds[i].matches[j].team1.name==m.teams[k].name)
                {
                    m.teams[k].draw=m.teams[k].draw+1;
                    m.teams[k].points=m.teams[k].points+1;
                    m.teams[k].gf=m.teams[k].gf+m.obj.rounds[i].matches[j].score1;
                    m.teams[k].ga=m.teams[k].ga+m.obj.rounds[i].matches[j].score2;
                    m.teams[k].gd=(m.teams[k].gf-m.teams[k].ga);
                }
                if(m.obj.rounds[i].matches[j].team2.name==m.teams[k].name)
                {
                  m.teams[k].points=m.teams[k].points+1;
                  m.teams[k].draw=m.teams[k].draw+1;
                  m.teams[k].gf=m.teams[k].gf+m.obj.rounds[i].matches[j].score2;
                  m.teams[k].ga=m.teams[k].ga+m.obj.rounds[i].matches[j].score1;
                  m.teams[k].gd=(m.teams[k].gf-m.teams[k].ga);
                }
            }
        }
      }
      console.log(m.teams);
}]);
