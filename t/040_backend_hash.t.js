StartTest(function(t) {
    
    var async0 = t.beginAsync()
    
    use([ 'KiokuJS.Backend.Hash' ], function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(KiokuJS.Backend.Hash, "KiokuJS.Backend.Hash is here")
        t.ok(KiokuJS.Node, "KiokuJS.Node is here")
        
        
        var backend = new KiokuJS.Backend.Hash()
        
        t.ok(backend, "KiokuJS.Backend.Hash was instantiated")
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Insert')
        
        
        
        backend.insert([
        
            new KiokuJS.Node({ 
                ID          : 1,
                
                className   : 'Object',
                
                backend     : backend,
                
                data        : { foo : "foo1" } 
            }),
            
            new KiokuJS.Node({ 
                ID          : 2, 
                
                className   : 'Object',
                
                backend     : backend,
                
                data        : { bar : "foo2" } 
            })
            
        ]).then(function () {
            
            //======================================================================================================================================================================================================================================================
            t.diag('Exists')
            
            
            backend.exists([ 1, 10, 2 ]).then(function (res) {
                
                t.ok(res[0], "Entry with ID = 1 exists")
                t.ok(!res[1], "Entry with ID = 10 doesn't exists")
                t.ok(res[2], "Entry with ID = 2 exists")
                
                //======================================================================================================================================================================================================================================================
                t.diag('Get')
                
                backend.get([ 2, 1, 10 ]).then(function (res) {
                
                    t.ok(res[0].data.bar == 'foo2', 'Entry with ID = 2, retrieved correctly')
                    t.ok(res[1].data.foo == 'foo1', 'Entry with ID = 1, retrieved correctly')
                    t.ok(res[2] == null, 'There is no entry with ID = 10')

                    
                    backend.remove([ 1, 2 ]).then(function () {
                    
                        backend.exists([ 1, 2 ]).then(function (res) {
                            
                            t.ok(!res[0], "Entry with ID = 1 doesn't exists")
                            t.ok(!res[1], "Entry with ID = 2 doesn't exists")
                            
                            t.endAsync(async0)
                            
                            t.done()
                        }).now()
                    }).now()
                }).now()
            }).now() 
        }).now()
    })
})    