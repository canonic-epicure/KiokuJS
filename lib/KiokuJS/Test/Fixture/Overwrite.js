Class('KiokuJS.Test.Fixture.Overwrite', {
    
    isa     : 'KiokuJS.Test.Fixture',
    
    use     : 'KiokuJS.Test.Person',
    
    has : {
        sort                    : 20
    },

    
    continued : {
        
        methods : {
            
            // XXX add tests for content-addressed objects
            
            
            populate : function (handle, t) {
                //======================================================================================================================================================================================================================================================
                t.diag('KiokuJS.Test.Fixture.Overwrite - Sanity')
                
                t.ok(KiokuJS.Test.Person, "'KiokuJS.Test.Person' is here")
        
                
                //======================================================================================================================================================================================================================================================
                t.diag('Graph setup')
                
                var Homer = new KiokuJS.Test.Person({
                    name    : 'Homer Simpson'
                })
                

                //======================================================================================================================================================================================================================================================
                t.diag('Populating')
                
                var scope = handle.newScope()
                
                scope.insertAs({ 'homer' : Homer }).now()
            },
            
            
            
            verify : function (handle, t) {

                var exceptionThrown = false

                
                var newScope            = handle.newScope()
                
                newScope.insertAs({ 'homer' : {} }).except(function (ex) {
                    
                    t.ok(ex instanceof KiokuJS.Exception.Overwrite, 'Correct exception thrown')
                    
                    exceptionThrown = true
                    
                    this.CONTINUE()
                
                }).andThen(function () {
                    
                    t.ok(exceptionThrown, 'Exception thrown on overwrite attempt')
                    
                    
                    newScope.lookUp('homer').andThen(function (homer3) {
                        
                        newScope.insertAs({ 'homer-copy' : homer3 }).except(function () {
                        
                            t.fail('Error during saving a copy of homer under different ID')
                            
                        }).now()
                        
                    }, this)
                })
            }
            
        }
    }

})
