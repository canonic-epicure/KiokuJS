StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')
    
    t.ok(KiokuJS.Backend.Hash, "KiokuJS.Backend.Hash is here")
    t.ok(KiokuJS.Node, "KiokuJS.Node is here")
    t.ok(KiokuJS.Resolver.Standard, "KiokuJS.Resolver.Standard is here")
    
    var resolver = new KiokuJS.Resolver.Standard()
    
    t.ok(resolver, "KiokuJS.Resolver.Standard was instantiated")
    
    var backend = new KiokuJS.Backend.Hash({
        resolver : resolver
    })
    
    t.ok(backend, "KiokuJS.Backend.Hash was instantiated")
    
    
    //======================================================================================================================================================================================================================================================
    t.diag('Insert')
    
    var async0 = t.beginAsync()
    
    backend.insert([
    
        new KiokuJS.Node({ 
            ID          : 1,
            
            className   : 'Object',
            
            resolver     : resolver,
            
            data        : { foo : "foo1" } 
        }),
        
        new KiokuJS.Node({ 
            ID          : 2, 
            
            className   : 'Object',
            
            resolver     : resolver,
            
            data        : { bar : "foo2" } 
        })
        
    ]).andThen(function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Exists')
        
        
        backend.exists([ 1, 10, 2 ]).andThen(function (res) {
            
            t.ok(res[0], "Entry with ID = 1 exists")
            t.ok(!res[1], "Entry with ID = 10 doesn't exists")
            t.ok(res[2], "Entry with ID = 2 exists")
            
            //======================================================================================================================================================================================================================================================
            t.diag('Get')
            
            backend.get([ 2, 1 ]).andThen(function (res) {
            
                t.ok(res[0].data.bar == 'foo2', 'Entry with ID = 2, retrieved correctly')
                t.ok(res[1].data.foo == 'foo1', 'Entry with ID = 1, retrieved correctly')
                
                backend.remove([ 1, 2 ]).andThen(function () {
                
                    backend.exists([ 1, 2 ]).andThen(function (res) {
                        
                        t.ok(!res[0], "Entry with ID = 1 doesn't exists")
                        t.ok(!res[1], "Entry with ID = 2 doesn't exists")
                        
                        t.done()
                        
                        t.endAsync(async0)
                    })
                })
            })
        }) 
    })
})    