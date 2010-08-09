Class('KiokuJS.Test.Fixture.StressLoad.Tree', {
    
    isa     : 'KiokuJS.Test.Fixture',
    
    use     : 'KiokuJS.Test.Vertex',
    
    
    has : {
        sort                    : 100
    },
    
    
    continued : {
        
        methods : {
            
            populate : function (handle, t) {
                //======================================================================================================================================================================================================================================================
                t.diag('KiokuJS.Test.Fixture.StressLoad.Tree - Sanity')
                
                t.ok(KiokuJS.Test.Vertex, 'KiokuJS.Test.Vertex is here')
                
                var CONT    = this.CONT
                var scope   = handle.newScope()
                
                for (var i = 1; i <= 10; i++) CONT.AND(function () {
                    
                    var CONTINUE = this.getCONTINUE()
                    
                    setTimeout(function () {
                        
                        scope.store(KiokuJS.Test.Vertex.createGeneration(3, 3)).andThen(function (genID) {
                            
                            var cleanScope = handle.newScope()
                            
                            cleanScope.lookUp(genID).andThen(function (vertex) {
                                
                                t.ok(vertex.verifyIntegrity(), 'Generation integrity is ok')
                                
                                CONTINUE()
                            })  
                        })
                        
                        
                    }, Math.floor(Math.random() * 3000))
                })
        
                
                CONT.now()
            }
            
        }
        // eof methods
    }
    // eof continued

})
