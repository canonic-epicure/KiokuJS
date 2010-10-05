Class('KiokuJS.Test.Fixture.Lazy', {
    
    isa     : 'KiokuJS.Test.Fixture',
    
    has : {
        sort                    : 10
    },

    
    continued : {
        
        methods : {
            
            populate : function (handle, t) {
                //======================================================================================================================================================================================================================================================
                t.diag('KiokuJS.Test.Fixture.Lazy - Sanity')
                
                t.ok(KiokuJS.Feature.Attribute.Lazy, 'KiokuJS.Feature.Attribute.Lazy is here')
                
                
                Class('TestClass', {
                    
                    has : {
                        
                        lazyAttr1 : {
                            trait   : KiokuJS.Feature.Attribute.Lazy
                        },
                        
                        
                        lazyAttr2 : {
                            trait   : KiokuJS.Feature.Attribute.Lazy
                        },
                        
                        
                        lazyAttr3 : {
                            trait   : KiokuJS.Feature.Attribute.Lazy
                        }
                    }
                })
                
                
                //======================================================================================================================================================================================================================================================
                t.diag('Graph setup')
                
                var bigArray    = [ 1, 2, 3 ]
                
                var instance = new TestClass({
                    lazyAttr1   : bigArray,
                    lazyAttr2   : bigArray,
                    
                    lazyAttr3   : 'yo'
                })
                
                t.ok(instance, 'Instance with lazy attributes has been instantiated successfully')

                
                //======================================================================================================================================================================================================================================================
                t.diag('Populating')
                
                var scope = handle.newScope()
                
                scope.storeAs({ instance : instance }).now()
            },
            
            
            verify : function (handle, t) {
                
                var newScope = handle.newScope()

                newScope.lookUp('instance').andThen(function (instance) {
                    
                    //======================================================================================================================================================================================================================================================
                    t.diag('Retrieving lazy attributes')
                    
                    this.CONTINUE()
                    
                }, this)
            }
        }
    }

})
