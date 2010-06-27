StartTest(function(t) {
    
	t.plan(1)
    
    var async0 = t.beginAsync()
    
    use('KiokuJS', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
	
        
        var handler = new KiokuJS({
            
            backend     : new KiokuJS.Backend.CouchDB({
                url     : 'http://couchdb.org'
            }),
            
            
            resolver    : new KiokuJS.Resolver([
                {                                                          |   new KiokuJS.TypeMap.Naive({
                    meta        : 'KiokuJS.TypeMap.Naive',                 |       forClass    : 'Some.Class',
                                                                           |       
                    forClass    : 'Some.Class',                            |       inherit     : true,
                                                                           |       intrinsic   : true
                    inherit     : true,                                    |   }})
                    intrinsic   : true                                     |
                },
                
                {
                    meta        : 'KiokuJS.Resolver',
                    
                    entries     : [
                        {
                            meta        : 'KiokuJS.TypeMap.Naive',
                            
                            forClass    : 'Some.Override'
                        },
                        
                        {
                            meta        : 'KiokuJS.Resolver',
                            
                            entries     : [
                                {
                                    meta        : 'KiokuJS.TypeMap.Naive',
                                    
                                    forClass    : 'Some.Override'
                                },
                                {
                                    meta        : 'KiokuJS.TypeMap.Naive',
                                    
                                    forClass    : 'Yet.Another.Class'
                                }
                            ]
                        }
                    ]
                },
                
                
                {
                    meta        : 'KiokuJS.TypeMap.Callbacks',
                    
                    forClass    : 'Some.Another.Class',
                    
                    intrinsic : true,
                    
                    collapse : function () {
                        // do collapse
                    },
                
                    expand : function () {
                        // do expand
                    }
                }
            ])
            
        })
        
        
        
        Class('Person', {
            does    : [ '...' ],
            traits  : [ '...' ],
            
            has : {
                name    : null,
                
                spouse  : {
                    isa : 'Person' //not yet implemeted in Joose 3
                }
            },
            
            methods : {
                //...
            }
        })
        
        
        var homer = new Person({
            name : 'Homer'
        })
        

        var marge   = new Person({
            name : 'Marge'
        })
        
        
        homer.spouse = marge
        marge.spouse = homer
        
        
        var scope = handler.newScope()
        
        scope.store({
            'homerId' : homer
        }).then(function (homerId) {
            
            ...
            
        })
        

        //...
        
        
        scope.lookUp('homerId').then(function (kindaHomer) {
            
            kindaHomer === homer // true
            
        })
        
        
        
        t.endAsync(async0)
    })
})    