StartTest(function(t) {
    
	t.plan(1)
    
    var async0 = t.beginAsync()
    
    use('JiojuDB', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(JiojuDB, "'JiojuDB' is here")
        
        
        Class('Person', {
            
            has : {
                name    : null,
                
                spouse  : null,
                
                farther : null,
                mother  : null,
                
                children : Joose.I.Array
            }
        })
        
        
        var Homer = new Person({
            name    : 'Homer Simpson'
        })
        
        var Marge = new Person({
            name    : 'Marge Simpson'
        })
        
        var Bart = new Person({
            name    : 'Bart Simpson'
        })
        
        var Lisa = new Person({
            name    : 'Lisa Simpson'
        })
        
        
        Homer.spouse    = Marge
        Marge.spouse    = Homer
        
        Bart.farther    = Lisa.farther  = Homer
        Bart.mother     = Lisa.mother   = Marge
        
        Homer.children.push(Bart, Lisa)
        Marge.children.push(Bart, Lisa)
        
        
        var handler = new JiojuDB({
            backend : new JiojuDB.Backend.Hash()
        })
        
        
        handler.store(Homer).then(function (homerID) {
            
            var HomerCopy = handler.lookUp(homerID)
            
            // HomerCopy === Homer
            // HomerCopy.spouse === Marge
            // etc
            
        })
        
        
        t.endAsync(async0)
    })
})    