Class('KiokuJS.Test.Fixture.Immutable', {
    
    isa     : 'KiokuJS.Test.Fixture',
    
    
    has : {
        sort                    : 10
    },

    
    continued : {
        
        methods : {
            
            populate : function (handle, t) {
                //======================================================================================================================================================================================================================================================
                t.diag('KiokuJS.Test.Fixture.Immutable - Sanity')
                

                t.ok(KiokuJS.Feature.Class.Immutable, 'KiokuJS.Feature.Class.Immutable is here')
                
                
                Class('Test.Immutable', {
                    
                    does : KiokuJS.Feature.Class.Immutable,
                    
                    has : {
                        slot1           : null,
                        slot2           : null
                    }
                })
        

                
                //======================================================================================================================================================================================================================================================
                t.diag('Graph setup')
                
                var mutable     = [ 'foo' ]
                
                var immutable   = new Test.Immutable({ 
                    slot1 : 'foo1', 
                    slot2 : mutable 
                })
                
                

                //======================================================================================================================================================================================================================================================
                t.diag('Populating')
                
                var scope = handle.newScope()
                
                scope.storeAs({
                    
                    immutable   : immutable
                    
                }).now()
            },
            
            
            verify : function (handle, t) {
                
                var newScope = handle.newScope()
                
                newScope.lookUp('immutable').andThen(function (immutable) {
                    
                    t.ok(immutable.slot1 == 'foo1', 'Correct value for `slot1` of `immutable`')
                    t.ok(immutable.slot2[ 0 ] == 'foo' && immutable.slot2.length == 1, 'Correct value for `slot2` of `immutable`')
                    
                    immutable.slot2.push('baz')
                    
                    newScope.store(immutable).andThen(function (immutableID) {
                        
                        t.ok(immutableID == 'immutable', 'Correct ID passed after `store`')
                        
                        
                        var cleanScope1 = handle.newScope()
                        
                        cleanScope1.lookUp('immutable').andThen(function (immutable) {
                            t.ok(immutable.slot1 == 'foo1', 'Correct value for `slot1` of `immutable`')
                            t.ok(immutable.slot2[ 0 ] == 'foo' && immutable.slot2.length == 1, 'Immutable object does not update referenced objects when stored 2nd time')
                            
                            
                            cleanScope1.insertAs({ immutable : immutable }).except(function (e) {
                                
                                t.fail('Exception during repeated storage of immutable object')
                                
                                this.CONTINUE()
                            
                            }).now()
                            
                        })
                    })
                })
            }
        }
    }

})
