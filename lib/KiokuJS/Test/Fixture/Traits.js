Class('KiokuJS.Test.Fixture.Traits', {
    
    isa     : 'KiokuJS.Test.Fixture',
    
    use     : 'KiokuJS.Test.Person',
    
    has : {
        sort                    : 10,
        
        homerID                 : null
    },

    
    continued : {
        
        methods : {
            
            populate : function (handle, t) {
                //======================================================================================================================================================================================================================================================
                t.diag('KiokuJS.Test.Fixture.Traits - Sanity')
                
                t.ok(KiokuJS.Test.Person, "'KiokuJS.Test.Person' is here")
                t.ok(KiokuJS.Test.Person.Hobby, "'KiokuJS.Test.Person.Hobby' is here")
        
                
                //======================================================================================================================================================================================================================================================
                t.diag('Graph setup')
                
                var Homer = new KiokuJS.Test.Person({
                    name    : 'Homer Simpson',
                    
                    trait   : KiokuJS.Test.Person.Hobby
                })
                
                var Marge = new KiokuJS.Test.Person({
                    name    : 'Marge Simpson'
                })
                
                var Bart = new KiokuJS.Test.Person({
                    name    : 'Bart Simpson'
                })
                
                var Lisa = new KiokuJS.Test.Person({
                    name    : 'Lisa Simpson',
                    
                    trait   : KiokuJS.Test.Person.Hobby
                })
                
                t.ok(Homer.self == Homer, 'Self-reference established')
                
                Homer.spouse(Marge)
                Marge.spouse(Homer)
                
                Bart.father     = Lisa.father  = Homer
                Bart.mother     = Lisa.mother  = Marge
                
                var kids = [ Bart, Lisa ]
                
                Homer.children = Marge.children = kids


                //======================================================================================================================================================================================================================================================
                t.diag('Populating')
                
                var scope = handle.newScope()
                
                scope.store(Homer).andThen(function (homerID) {
                    
                    this.homerID = homerID
                    
                    this.CONTINUE()
                    
                }, this)
            },
            
            
            verify : function (handle, t) {
                
                var newScope = handle.newScope()
                
                newScope.lookUp(this.homerID).andThen(function (homer3) {
                    
                    //======================================================================================================================================================================================================================================================
                    t.diag('Retrieving from backend')
                
                    t.ok(homer3.meta.isDetached, 'Retrieved Homer has traits')
                    
                    t.ok(homer3.meta.does(KiokuJS.Test.Person.Hobby), 'Retrieved Homer has hobby')
                    
                    
                    homer3.doHobby()
                    
                    t.is(homer3.getMood(), 'good', 'Doing hobby is fun #1')
                    
                    
                    var lisa3 = homer3.children[1]
                    
                    t.ok(lisa3.meta.isDetached, 'Retrieved Lisa has traits')
                    
                    t.ok(lisa3.meta.does(KiokuJS.Test.Person.Hobby), 'Retrieved Lisa has hobby')
                    

                    lisa3.doHobby()
                    
                    t.is(lisa3.getMood(), 'good', 'Doing hobby is fun #2')
                    
                    

                    this.CONTINUE()
                    
                }, this)
            }
        }
    }

})
