StartTest(function(t) {
    
	t.plan(1)
    
    var async0 = t.beginAsync()
    
    use('JiojuDB.Role.UUID.Serial', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(JiojuDB.Role.UUID.Serial, "'JiojuDB.Role.UUID.Serial' is here")
        
        
        Class('Test', {
            
            does : JiojuDB.Role.UUID.Serial
        
        })
        
        var test = new Test()
        
//        debugger
        
        t.diag(test.generateUUID())
        t.diag(test.generateUUID())
        t.diag(test.generateUUID())
        
        
        t.endAsync(async0)
    })
})    