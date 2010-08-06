Class('KiokuJS.Test.Fixture.Remove', {
    
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
                t.diag('KiokuJS.Test.Fixture.Remove - Sanity')
                
                t.ok(KiokuJS.Test.Person, "'KiokuJS.Test.Person' is here")
        
                
                //======================================================================================================================================================================================================================================================
                t.diag('Graph setup')
                
                var Homer = this.originalHomer = new KiokuJS.Test.Person({
                    name    : 'Homer Simpson'
                })
                
                var Marge = new KiokuJS.Test.Person({
                    name    : 'Marge Simpson'
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
                
                Homer.children = Marge.children = kids


                //======================================================================================================================================================================================================================================================
                t.diag('Populating')
                
                var scope = handle.newScope()
                
                scope.store(Homer).andThen(function (homerID) {
                    
                    scope.remove(homerID, Marge).andThen(function () {
                        
                        //======================================================================================================================================================================================================================================================
                        t.diag('Examining scope')
                        
                        t.ok(!scope.objectPinned(Homer), 'Homer is not in scope now')
                        t.ok(!scope.objectPinned(Marge), 'Marge is not in scope now')
                        
                        t.ok(scope.objectPinned(Marge.children), 'Kids are in scope')
                        
                        t.ok(scope.objectPinned(Bart), 'Bart is in scope')
                        t.ok(scope.objectPinned(Lisa), 'Lisa is in scope')
                        
                        
                        //======================================================================================================================================================================================================================================================
                        t.diag('Retrieving removed key')
                        
                        var thrown = false
                        
                        handle.newScope().lookUp(homerID).except(function (e) {
                            
                            thrown = true
                            
                            t.isaOk(e, KiokuJS.Exception.LookUp, 'Correct exception thrown')
                            
                            this.CONTINUE()
                            
                        }).andThen(function () {
                            
                            t.ok(thrown, 'Exception thrown')
                            
                            this.CONTINUE()
                        })
                    })
                })
            }
        }
    }

})
