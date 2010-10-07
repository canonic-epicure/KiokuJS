Class('KiokuJS.Test.Fixture.AnimatePacket', {
    
    isa     : 'KiokuJS.Test.Fixture',
    
    
    has : {
        test1               : null,
        
        packet              : null
    },

    
    continued : {
        
        methods : {
            
            populate : function (handle, t) {
                //======================================================================================================================================================================================================================================================
                t.diag('KiokuJS.Test.Fixture.AnimatePacket - Sanity')
                
                
                //======================================================================================================================================================================================================================================================
                t.diag('Graph setup')
                
                Class('Test.Class', {
                    
                    has : {
                        attr1       : null,
                        attr2       : null
                    }
                })
                
                var test1 = new Test.Class({
                    attr1   : 'foo',
                    attr2   : 'bar'
                })
                
                this.test1 = test1

                //======================================================================================================================================================================================================================================================
                t.diag('Populating')
                
                var scope = handle.newScope()
                
                scope.store(test1).andThen(function (test1ID) {
                    
                    var test2 = new Test.Class({
                        attr1   : test1
                    })
                    
                    var test3 = new Test.Class({
                        attr1   : test1,
                        attr2   : test2
                    })
                    
                    
                    this.packet = scope.includeNewObjects({ test3 : test3 }, [ test2 ])
                    
                    this.CONTINUE()
                }, this)
            },
            
            
            verify : function (handle, t) {
                
                var newScope    = handle.newScope()
                
                //======================================================================================================================================================================================================================================================
                t.diag('Animating packet')
                
                newScope.animatePacket(this.packet).andThen(function (customIDs, IDs) {
                    
                    var test3 = customIDs.test3
                    
                    t.ok(test3, 'Something animated as the test3')
                    t.ok(IDs.length == 1, 'Something animated as the object w/o ids')
                    
                    var test21 = IDs[0]
                    var test22 = test3.attr2
                    
                    t.ok(test21 == test22, 'Correct relationships in animated graph #1')
                    
                    t.ok(test21.attr1 == test3.attr1, 'Correct relationships in animated graph #2')
                    
                    var test1 = test21.attr1
                    
                    t.ok(test1.attr1 == 'foo' && test1.attr2 == 'bar', 'Correctly fetched `test1` instance')
                    
                    t.ok(test1 != this.test1, 'Test1 is copy, not the same object')
                    
                    this.CONTINUE()
                }, this)
            }
        }
    }

})
