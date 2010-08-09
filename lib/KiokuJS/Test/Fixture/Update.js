// XXX this is not a test for KiokuJS.Backend.Feature.Update, just for scope.update & deepUpdate methods

Class('KiokuJS.Test.Fixture.Update', {
    
    isa     : 'KiokuJS.Test.Fixture',
    
    use     : 'KiokuJS.Test.Person',
    
    has : {
        sort                    : 10,
        
        homerID                 : null,
        
        requiredBackendRoles    : { 
            init : [ 'KiokuJS.Backend.Feature.Update' ] 
        }
    },

    
    continued : {
        
        methods : {
            
            populate : function (handle, t) {
                //======================================================================================================================================================================================================================================================
                t.diag('KiokuJS.Test.Fixture.Update - Sanity')
                
                t.ok(KiokuJS.Test.Person, "'KiokuJS.Test.Person' is here")
        
                
                //======================================================================================================================================================================================================================================================
                t.diag('Graph setup')
                
                var Homer = new KiokuJS.Test.Person({
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
                    
                    this.homerID = homerID
                    
                    this.CONTINUE()
                    
                }, this)
            },
            
            
            verify : function (handle, t) {
                
                var homerID     = this.homerID
                var newScope    = handle.newScope()
                
                newScope.lookUp(homerID).andThen(function (homer3) {
                    
                    //======================================================================================================================================================================================================================================================
                    t.diag('Retrieving from backend')
                
                    
                    var marge3 = homer3.spouse()
                    
                    homer3.name = 'Homer Simpson the 3rd'
                    marge3.name = 'Marge Simpson the 3rd'
                    
                    
                    newScope.update(homer3).andThen(function () {
                        
                        var cleanScope = handle.newScope()
                        
                        cleanScope.lookUp(homerID).andThen(function (homer4) {
                            
                            //======================================================================================================================================================================================================================================================
                            t.diag('Examining changes')
                            

                            t.ok(homer4.name == 'Homer Simpson the 3rd', 'Homer was updated')
                            
                            var marge4 = homer4.spouse()
                            
                            t.ok(marge4.name == 'Marge Simpson', 'But Marge not, as it was not a deep update')
                            
                            
                            //======================================================================================================================================================================================================================================================
                            t.diag('Deep update')

                            homer4.name = 'Homer Simpson the 4th'
                            marge4.name = 'Marge Simpson the 4th'
                            
                            
                            cleanScope.deepUpdate(homer4).andThen(function () {
                                
                                var cleanScope2 = handle.newScope()
                                
                                var CONTINUE = this.getCONTINUE()
                                
                                
                                // XXX this prevents a very weird behavior of FF 3.6.8 for Ubuntu
                                // when 2 GET requests are somehow skipped
                                // all other browsers (even FF 3.6.8 for Windows) aren't affected
                                setTimeout(function () {
                                    
                                    cleanScope2.lookUp(homerID).andThen(function (homer5) {
                                        
                                        //======================================================================================================================================================================================================================================================
                                        t.diag('Examining changes')
                                        
            
                                        t.ok(homer5.name == 'Homer Simpson the 4th', 'Homer was updated')
                                        
                                        var marge5 = homer5.spouse()
                                        
                                        t.ok(marge5.name == 'Marge Simpson the 4th', 'And Marge also, as it was a deep update')
                                        
                                        
                                        CONTINUE()
                                    })
                                    
                                }, 100)
                                
                            })
                        })
                    })
                })
            }
        }
    }

})
