StartTest(function(t) {
    
    var async0 = t.beginAsync()
    
    use([ 'KiokuJS.Test', 'KiokuJS.Test.Person', 'KiokuJS.Backend.Hash' ], function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(KiokuJS.Test, "KiokuJS.Test is here")
        t.ok(KiokuJS.Backend.Hash, "KiokuJS.Backend.Hash is here")
        t.ok(KiokuJS.Test.Person, "KiokuJS.Test.Person is here")
        
        new KiokuJS.Test().runAllFixtures({
            t       : t,
            
            init    : function () {
                return KiokuJS.connect({
                    backend : new KiokuJS.Backend.Hash()
                })
            }
            
        }).then(function () {
            
            t.endAsync(async0)
            
            t.done()
            
        }).now()
    })
})    