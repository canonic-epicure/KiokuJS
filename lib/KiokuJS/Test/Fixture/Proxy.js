Class('KiokuJS.Test.Fixture.Proxy', {
    
    isa     : 'KiokuJS.Test.Fixture',
    
    
    has : {
        ID                      : null,
        
        sort                    : 10
    },

    
    continued : {
        
        methods : {
            
            populate : function (handle, t) {
                //======================================================================================================================================================================================================================================================
                t.diag('KiokuJS.Test.Fixture.Proxy - Sanity')
                
                
                Class('With.Proxy', {
                    
                    has : {
                        outerProxy      : null,
                        attr            : null
                    }
                })
        

                
                //======================================================================================================================================================================================================================================================
                t.diag('Graph setup')
                
                var proxy     = { 'bar' : 'baz' }
                
                var withproxy   = new With.Proxy({ 
                    outerProxy  : proxy, 
                    attr        : [ 'foo', proxy ] 
                })
                
                

                //======================================================================================================================================================================================================================================================
                t.diag('Populating')
                
                var scope = handle.newScope()
                
                scope.registerProxy(proxy, 'proxy')
                
                scope.store(withproxy).andThen(function (ID) {
                    
                    this.ID = ID
                    
                    this.CONTINUE()
                    
                }, this)
            },
            
            
            verify : function (handle, t) {
                
                var newScope    = handle.newScope()
                var proxy       = []
                
                newScope.registerProxy(proxy, 'proxy')
                
                newScope.lookUp(this.ID).andThen(function (withproxy) {
                    
                    t.ok(withproxy.attr[0] == 'foo', '`withproxy` has been correctly restored from DB')
                    t.ok(withproxy.attr[1] == proxy, 'Proxy has been correctly set from the scope #1')
                    
                    t.ok(withproxy.outerProxy == proxy, 'Proxy has been correctly set from the scope #2')
                    
                    this.CONTINUE()
                })
            }
        }
    }

})
