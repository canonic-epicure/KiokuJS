Class('KiokuJS.Resolver.Standard', {
    
    isa         : 'KiokuJS.Resolver',
    
    
    use         : [
        'KiokuJS.TypeMap.Feature.NoDeps',
    
        'KiokuJS.TypeMap.Joose',
        'KiokuJS.TypeMap.Object',
        'KiokuJS.TypeMap.Array'
    ],
    

    
    after : {
        
        initialize : function () {
            
            // the order matter
            
            this.addEntry(new KiokuJS.TypeMap.Joose({
                trait : KiokuJS.TypeMap.Feature.NoDeps,
                
                inherit : true
            }))
            
            this.addEntry(new KiokuJS.TypeMap.Object())
            
            this.addEntry(new KiokuJS.TypeMap.Array())
        }
    }

})
