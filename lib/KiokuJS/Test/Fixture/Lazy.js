Class('KiokuJS.Test.Fixture.Lazy', {
    
    isa     : 'KiokuJS.Test.Fixture',
    
    use     : 'KiokuJS.Test.Person',
    
    has : {
        sort                    : 10,
        
        originalHomer           : null,
        homerID                 : null
    },

    
    continued : {
        
        methods : {
            
            populate : function (handle, t) {
                //======================================================================================================================================================================================================================================================
                t.diag('KiokuJS.Test.Fixture.Lazy - Sanity')
                
                t.ok(KiokuJS.Test.Person, "'KiokuJS.Test.Person' is here")
        
                
                //======================================================================================================================================================================================================================================================
                t.diag('Graph setup')
                
                var Homer = this.originalHomer = new KiokuJS.Test.Person({
                    name    : 'Homer Simpson',
                    
                    task    : function () { return "Beer" }
                })
                
                var margesTask = function () { return "Children" }
                
                var Marge = new KiokuJS.Test.Person({
                    name    : 'Marge Simpson',
                    
                    task    : margesTask
                })
                
                var Bart = new KiokuJS.Test.Person({
                    name    : 'Bart Simpson'
                })
                
                var Lisa = new KiokuJS.Test.Person({
                    name    : 'Lisa Simpson'
                })
                
                t.ok(Homer.self == Homer, 'Self-reference established')
                
                Homer.spouse(Marge)
                Marge.spouse(Homer)
                
                Bart.father     = Lisa.father  = Homer
                Bart.mother     = Lisa.mother  = Marge
                
                var kids = [ Bart, Lisa ]
                
                Homer.children = Marge.children = margesTask.children = kids


                //======================================================================================================================================================================================================================================================
                t.diag('Populating')
                
                var scope = handle.newScope()
                
                scope.store(Homer).andThen(function (homerID) {
                    
                    this.homerID = homerID
                    
                    //======================================================================================================================================================================================================================================================
                    t.diag('Retrieving live object from the same scope')
                
                    scope.lookUp(homerID).andThen(function (homer2) {
                        
                        t.ok(homer2 === Homer, 'Retrieved the Homer object from live objects')
                        
                        this.CONTINUE()
                    })
                    
                }, this)
            },
            
            
            verify : function (handle, t) {
                
                var newScope = handle.newScope()
                

                newScope.lookUp(this.homerID).andThen(function (homer3) {
                    
                    //======================================================================================================================================================================================================================================================
                    t.diag('Retrieving from backend')
                
                    t.ok(homer3 !== this.originalHomer, 'Retrieved Homer is another instance this time')
                    
                    t.ok(homer3.name == 'Homer Simpson', 'But it has a correct name')
                    t.ok(homer3.self === homer3, 'Self-reference was reflected correctly #1')
                    
                    t.ok(homer3.task() == 'Beer', 'Correctly de-serialized function #1')
                    
                    
                    var marge3 = homer3.spouse()
                    
                    t.ok(marge3.self = marge3, 'Self-reference was reflected correctly #2')
                    
                    t.ok(marge3 instanceof KiokuJS.Test.Person, 'Marge2 isa Person')
                    t.ok(marge3.name == 'Marge Simpson', 'Marge has a correct name')
                    
                    t.ok(marge3.task() == 'Children', 'Correctly de-serialized function #2')
                    
                    t.ok(marge3.spouse() === homer3, 'Marge2&Homer2 are spouses')
                    
                    t.ok(marge3.children === homer3.children, 'Marge2&Homer2 have correct kids')
                    t.ok(marge3.children === marge3.task.children, 'Marge2 also has children array attached to its `task`')
                    
                    
                    
                    var kids = marge3.children
                    
                    t.ok(kids.length == 2, 'we forgot Maggy..')
                    
                    t.ok((kids[0] instanceof KiokuJS.Test.Person) && (kids[1] instanceof KiokuJS.Test.Person), 'Both kids are Persons')
                    
                    var bart3 = kids[0]
                    var lisa3 = kids[1]
                    
                    t.ok(bart3.name == 'Bart Simpson', 'First kid in array is Bart')
                    t.ok(lisa3.name == 'Lisa Simpson', 'Second kid in array is Lisa')
                    
                    t.ok(bart3.father == homer3 && bart3.mother == marge3, 'Bart3 has correct parents')
                    t.ok(lisa3.father == homer3 && lisa3.mother == marge3, 'Lisa3 has correct parents')
                    

                    //======================================================================================================================================================================================================================================================
                    t.diag('Examining scope')
                    
                    t.ok(newScope.objectPinned(homer3), 'Homer is in scope')
                    t.ok(newScope.objectPinned(marge3), 'Marge is in scope')
                    
                    t.ok(newScope.objectPinned(marge3.children), 'Kids are in scope')
                    
                    t.ok(newScope.objectPinned(bart3), 'Bart is in scope')
                    t.ok(newScope.objectPinned(lisa3), 'Lisa is in scope')
                    
                    
                    //======================================================================================================================================================================================================================================================
                    t.diag('Retrieving unknown key')
                    
                    var thrown = false
                    
                    newScope.lookUp('foobar').except(function (e) {
                        
                        thrown = true
                        
                        t.isaOk(e, KiokuJS.Exception.LookUp, 'Correct exception thrown')
                        
                        this.CONTINUE()
                        
                    }).andThen(function () {
                        
                        t.ok(thrown, 'Exception thrown')
                        
                        this.CONTINUE()
                    })
                    
                }, this)
            }
        }
    }

})
