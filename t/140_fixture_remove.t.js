StartTest(function(t) {
    
    var async0 = t.beginAsync()
    
    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')
    
    t.ok(KiokuJS.Test, "KiokuJS.Test is here")
    t.ok(KiokuJS.Backend.Hash, "KiokuJS.Backend.Hash is here")
    
    new KiokuJS.Test({
        t           : t,
        
        fixtures    : [ 'Remove' ],
        
        connect     : function () {
            this.CONTINUE(new KiokuJS.Backend.Hash())
        }
        
    }).runAllFixtures().andThen(function () {
        
        t.endAsync(async0)
        
        t.done()
    })
})    