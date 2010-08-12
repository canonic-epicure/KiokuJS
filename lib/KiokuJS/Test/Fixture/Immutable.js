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
                
                
                t.ok(KiokuJS.Feature.Class.Intrinsic, 'KiokuJS.Feature.Class.Intrinsic is here')
                t.ok(KiokuJS.Feature.Attribute.Intrinsic, 'KiokuJS.Feature.Attribute.Intrinsic is here')
                
                
                Class('Test.Wrapper', {
                    
                    has : {
                        slot            : null,
                        
                        intrinsicSlot   : {
                            trait : KiokuJS.Feature.Attribute.Intrinsic
                        }
                    }
                })
        

                Class('Test.Value.Intrinsic', {
                    
                    does : KiokuJS.Feature.Class.Intrinsic,
                    
                    has : {
                        value : null
                    }
                })
                
                
                
                //======================================================================================================================================================================================================================================================
                t.diag('Graph setup')
                
                var sharedValue1 = new Test.Value.Intrinsic({ value : 'value' })
                var sharedValue2 = [ 'foo' ]
                
                
                var wrapper1 = new Test.Wrapper({ slot : sharedValue1, intrinsicSlot : sharedValue2 })
                var wrapper2 = new Test.Wrapper({ slot : sharedValue1, intrinsicSlot : sharedValue2 })
                var wrapper3 = new Test.Wrapper({ slot : sharedValue1, intrinsicSlot : sharedValue2 })


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
                    
                    t.ok(wrapper1.intrinsicSlot != wrapper2.intrinsicSlot && wrapper2.intrinsicSlot != wrapper3.intrinsicSlot && wrapper1.intrinsicSlot != wrapper3.intrinsicSlot, 'All `intrinsicSlot` attributes are now different object')
                    
                    Joose.A.each(arguments, function (wrapper) {
                        t.ok(wrapper.slot.value == 'value', 'All `slot` has correct values though')
                        
                        t.ok(wrapper.intrinsicSlot[ 0 ] == 'foo', 'All `intrinsicSlot` has correct values though')
                    })
                    
                    this.CONTINUE()
                    
                }, this)
            }
        }
    }

})
