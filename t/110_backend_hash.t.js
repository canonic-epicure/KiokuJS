StartTest(function(t) {
    
    var async0 = t.beginAsync()
    
    use([ 'KiokuJS.Test', 'KiokuJS.Backend.Hash' ], function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(KiokuJS.Test, "KiokuJS.Test is here")
        t.ok(KiokuJS.Backend.Hash, "KiokuJS.Backend.Hash is here")
        
        var test = new KiokuJS.Test()
        
        test.runAllFixtures({
            t       : t,
            
            init    : function () {
                return new KiokuJS({
                    backend : new KiokuJS.Backend.Hash()
                })
            }
            
        }).then(function () {
            
            t.endAsync(async0)
            t.done()
            
        }).now()
    })
})    