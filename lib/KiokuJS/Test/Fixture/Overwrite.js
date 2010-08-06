Class('KiokuJS.Test.Fixture.Overwrite', {
    
    isa     : 'KiokuJS.Test.Fixture',
    
    use     : [ 'KiokuJS.Test.Person', 'KiokuJS.Backend.Feature.Overwrite' ],
    
    
    has : {
        sort                    : 20,
        
        requiredBackendRoles    : { 
            init : [ 'KiokuJS.Backend.Feature.Overwrite' ] 
        }
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
                    
                    this.CONTINUE()
                })
            }
            
        }
    }

})
