Class('KiokuJS.Test.Fixture.Intrinsic', {
    
    isa     : 'KiokuJS.Test.Fixture',
    
    
    has : {
        sort                    : 10
    },

    
    continued : {
        
        methods : {
            
            populate : function (handle, t) {
                //======================================================================================================================================================================================================================================================
                t.diag('KiokuJS.Test.Fixture.Intrinsic - Sanity')
                
                
                t.ok(KiokuJS.Meta.Class.Intrinsic, 'KiokuJS.Meta.Class.Intrinsic is here')
                
                
                Class('Test.Wrapper', {
                    
                    has : {
                        slot : null
                    }
                })
        

                Class('Test.Value', {
                    
                    trait : KiokuJS.Meta.Class.Intrinsic,
                    
                    has : {
                        value : null
                    }
                })
                
                
                
                //======================================================================================================================================================================================================================================================
                t.diag('Graph setup')
                
                var sharedValue = new Test.Value({ value : 'value' })
                
                var wrapper1 = new Test.Wrapper({ slot : sharedValue })
                var wrapper2 = new Test.Wrapper({ slot : sharedValue })
                var wrapper3 = new Test.Wrapper({ slot : sharedValue })


                //======================================================================================================================================================================================================================================================
                t.diag('Populating')
                
                var scope = handle.newScope()
                
                scope.storeAs({
                    
                    wrapper1 : wrapper1,
                    wrapper2 : wrapper2,
                    wrapper3 : wrapper3
                    
                }).now()
            },
            
            
            verify : function (handle, t) {
                
                var newScope = handle.newScope()
                
                newScope.lookUp('wrapper1', 'wrapper2', 'wrapper3').andThen(function (wrapper1, wrapper2, wrapper3) {
                    
                    t.ok(wrapper1.slot != wrapper2.slot && wrapper2.slot != wrapper3.slot && wrapper1.slot != wrapper3.slot, 'All `slot` attributes are now different object')
                    
                    Joose.A.each(arguments, function (wrapper) {
                        t.ok(wrapper.value == 'value', 'All has correct values though')
                    })
                    
                    this.CONTINUE()
                    
                }, this)
            }
        }
    }

})
