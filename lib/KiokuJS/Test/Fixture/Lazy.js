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
                        },
                        
                        usualAttr   : 'foo'
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
                
                t.ok(instance.getLazyAttr1() instanceof JooseX.CPS.Continuation, 'Correct result from getter #1')
                
                instance.getLazyAttr1().andThen(function (value) {
                    t.ok(value == bigArray, 'Correct result from getter #2')
                    
                    t.ok(this == instance, 'Scope of getter is the instance itself #1')
                    
                    //======================================================================================================================================================================================================================================================
                    t.diag('Populating')
                    
                    var scope = handle.newScope()
                    
                    scope.storeAs({ instance : instance }).now()
                })
            },
            
            
            verify : function (handle, t) {
                
                var newScope = handle.newScope()

                newScope.lookUp('instance').andThen(function (instance) {
                    
                    //======================================================================================================================================================================================================================================================
                    t.diag('Retrieving lazy attributes')
                    
                    t.ok(instance && instance.usualAttr == 'foo', 'Instance seems to be restored correctly #1')
                    
                    instance.getLazyAttr3().andThen(function (value) {
                        t.ok(value == 'yo', 'Instance seems to be restored correctly #2')
                        
                        t.ok(this == instance, 'Scope of getter is the instance itself #2')
                        
                        
                        instance.getLazyAttr1(newScope).andThen(function (value1) {
                            t.isDeeply(value1, [ 1, 2, 3 ], 'Value of `lazyAttr1` is correct')
                            
                            instance.getLazyAttr2(newScope).andThen(function (value2) {
                                t.isDeeply(value2, [ 1, 2, 3 ], 'Value of `lazyAttr2` is correct')
                                
                                t.ok(value1 == value2, 'Lazy attribute has been correctly pulled from scope')
                                
                                this.CONT.CONTINUE()
                            })
                        })
                    })
                })
            }
        }
    }

})
