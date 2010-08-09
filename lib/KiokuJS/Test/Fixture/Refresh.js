Class('KiokuJS.Test.Fixture.Refresh', {
    
    isa     : 'KiokuJS.Test.Fixture',
    
    use     : 'KiokuJS.Test.Person',
    
    has : {
        sort                    : 150
    },

    
    continued : {
        
        methods : {
            
            populate : function (handle, t) {
                //======================================================================================================================================================================================================================================================
                t.diag('KiokuJS.Test.Fixture.ObjectGraph - Sanity')
                
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
                
                var scope1 = handle.newScope()
                var scope2 = handle.newScope()
                
                scope1.store(Homer).andThen(function (homerID) {
                    
                    scope2.lookUp(homerID).andThen(function (homer2) {
                        
                        t.ok(homer2 != Homer, 'Retrieved another copy of Homer')
                        
                        //======================================================================================================================================================================================================================================================
                        t.diag('Changing values deeply in graph')
                
                        homer2.name             = 'Homer Simpson the 2nd'
                        homer2.spouse().name    = 'Marge Simpson the 2nd'
                        homer2.children[0].name = 'Bart Simpson the 2nd'
                        homer2.children[1].name = 'Lisa Simpson the 2nd'
                        

                        scope2.store(homer2).andThen(function () {
                            
                            scope1.refresh(Homer).andThen(function () {
                                
                                t.ok(Homer.name == 'Homer Simpson the 2nd', 'Correct name for refreshed Homer')
                                t.ok(Marge.name == 'Marge Simpson', 'But Marge name is still the same, as it was not deep update')
                                
                                scope1.deepRefresh(Homer).andThen(function () {
                                    
                                    t.ok(Homer.name == 'Homer Simpson the 2nd', 'Correct name for refreshed Homer')
                                    t.ok(Marge.name == 'Marge Simpson the 2nd', 'Marge name is now also refreshed')
                                    
                                    t.ok(Homer.children[0].name == 'Bart Simpson the 2nd', '... as well as Bart')
                                    t.ok(Homer.children[1].name == 'Lisa Simpson the 2nd', '... as well as Lisa')
                                    
                                    this.CONTINUE()
                                })
                            })
                        })
                    })
                })
            }
        }
    }

})
